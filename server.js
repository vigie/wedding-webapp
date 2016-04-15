/**
 * @license
 * Everything in this repo is MIT License unless otherwise specified.
 *
 * Copyright (c) Addy Osmani, Sindre Sorhus, Pascal Hartig, Stephen  Sawchuk, Google, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// set up ========================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var argv = require('optimist').argv;
var Sendgrid = require('sendgrid')(
  process.env.SENDGRID_API_KEY || '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'
);

// configuration =================

mongoose.connect('mongodb://' + argv.be_ip + ':80/my_database');

app.use(express.static(__dirname));
app.use('/app', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Guest = mongoose.model('Guest', {
    _id: String,
    firstName: String,
    lastName: String,
    email: String,
    welcomeMsg: String,
    plusOne: String,
    gsy_invite: String,
    sf_invite: String,
    sc_invite: String,
    gsy_response: String,
    sf_response: String,
    sc_response: String
 });

// routes ======================================================================

// api ---------------------------------------------------------------------

app.post('/api/email', function(req, res) {
    
    Sendgrid.send(
        {
            from: 'mattandtamaraswedding@gmail.com', // From address
            to: 'mattandtamaraswedding@gmail.com', // To address
            subject: 'Wrong email for ' + req.body.name, // Subject
            text: req.body.name + '\'s email is ' + req.body.email // Content
        }, 
        function (err, json) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(json); 
                res.send(json);
            }
        });    
    
});

app.put('/api/guests', function(req, res) {
    var guests = req.body;
    //console.log(guests);
    var options = {
        upsert: false,
        new: true
    }
    var updatedGuests = [];
    var count = guests.length;
    guests.forEach(function(guest) {
        var id = guest._id;
        delete guest._id;
        Guest.findByIdAndUpdate(id, guest, function(err, doc) {
            if (err) {
                res.send(err);
            } else {
                count--;
                updatedGuests.push(doc);
                if (count === 0) {
                    sendRsvpEmail(updatedGuests);
                    res.send(updatedGuests);
                }
            }
        });
    }, this);
});

function sendRsvpEmail(guests) {
    if (!guests || !guests.length) {
        return;
    }
    var guest1 = guests[0];
    var guest2;
    if (guests.length > 1) {
        guest2 = guests[1];
    }
    var subject = 'RSVP from ' + guest1.firstName;
    if (guest2) {
        subject += ' and ' + guest2.firstName;
    }
    
    var guest1Body = guest1.firstName + ' ' + guest1.lastName + ' RSVP:\n\n';
    if (guest1.gsy_invite === 'yes') {
        guest1Body += 'Guernsey: ' + guest1.gsy_response + '\n\n';
    }
    if (guest1.sf_invite === 'yes') {
        guest1Body += 'SF: ' + guest1.sf_response + '\n\n';
    }
    if (guest1.sc_invite === 'yes') {
        guest1Body += 'SC: ' + guest1.sc_response + '\n\n';
    }
    
    var guest2Body = '\n\n';
    if (guest2) {
        guest2Body += guest2.firstName + ' ' + guest2.lastName + ' RSVP:\n\n';
        if (guest2.gsy_invite === 'yes') {
            guest2Body += 'Guernsey: ' + guest2.gsy_response + '\n\n';
        }
        if (guest2.sf_invite === 'yes') {
            guest2Body += 'SF: ' + guest2.sf_response + '\n\n';
        }
        if (guest2.sc_invite === 'yes') {
            guest2Body += 'SC: ' + guest2.sc_response + '\n\n';
        }
    }
    
    var body = guest1Body + guest2Body;
    
    Sendgrid.send(
        {
            from: 'mattandtamaraswedding@gmail.com', // From address
            to: 'mattandtamaraswedding@gmail.com', // To address
            subject: subject, // Subject
            text: body // Content
        }, 
        function (err, json) {
            if (err) {
                console.log(req.body);
            } else {
                console.log(json);
            }
        });     
    
}

// Get guest by email
app.get('/api/guests', function(req, res) {
    if (req.query && req.query.email) {
        Guest.findOne({email: req.query.email}, function(err, guest) {
            if (err) {
                res.send(err);
            }
            res.json(guest)
        });
        return;
    }
});

// Get all todos
app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });

});


// // create todo and send back all todos after creation
// app.post('/api/todos', function(req, res) {

// 	// create a todo, information comes from AJAX request from Angular
// 	Todo.create({
// 		title : req.body.title,
// 		completed : false
// 	}, function(err, todo) {
// 		if (err)
// 			res.send(err);

// 		// get and return all the todos after you create another
// 		Todo.find(function(err, todos) {
// 			if (err)
// 				res.send(err)
// 			res.json(todos);
// 		});
// 	});

// });

// app.put('/api/todos/:todo_id', function(req, res){
//   return Todo.findById(req.params.todo_id, function(err, todo) {
//     todo.title = req.body.title;
//     todo.completed = req.body.completed;
//     return todo.save(function(err) {
//       if (err) {
//         res.send(err);
//       }
//       return res.send(todo);
//     });
//   });
// });

app.get('/api/guests/:guest_id', function(req, res){
  return Guest.findById(req.params.guest_id, function(err, guest) {
    if (err) {
        res.send(err);
    }
    return res.send(guest);
  });
});

// // delete a todo
// app.delete('/api/todos/:todo_id', function(req, res) {
// 	Todo.remove({
// 		_id : req.params.todo_id
// 	}, function(err, todo) {
// 		if (err)
// 			res.send(err);

// 		// get and return all the todos after you create another
// 		Todo.find(function(err, todos) {
// 			if (err)
// 				res.send(err)
// 			res.json(todos);
// 		});
// 	});
// });

// application -------------------------------------------------------------
app.get('/', function(req, res) {
    res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
// Handle html5mode
app.get('/*', function(req, res) { 
  res.sendfile(__dirname + '/index.html');
});

// listen (start app with node server.js) ======================================
app.listen(8080, argv.fe_ip);
console.log("App listening on port 8080");