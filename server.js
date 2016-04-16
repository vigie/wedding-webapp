// set up ========================
var express  = require('express');
var app      = express(); 
var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var argv = require('optimist').argv;
var Sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

// configuration =================

mongoose.connect('mongodb://' + argv.be_ip + ':80/my_database');

app.use('/app', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// Define Schema
var GuestSchema = new Schema({
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
    sc_response: String,
    address: String,
    phone: String,
    relationship: String,
    domiciled: String    
});

// Exclude sensitive fields not used by webapp
GuestSchema.path('address').select(false);
GuestSchema.path('phone').select(false);
GuestSchema.path('relationship').select(false);
GuestSchema.path('domiciled').select(false);

// define model =================
var Guest = mongoose.model('Guest', GuestSchema);

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

app.get('/api/guests/:guest_id', function(req, res){
  return Guest.findById(req.params.guest_id, function(err, guest) {
    if (err) {
        res.send(err);
    }
    console.log(guest);
    return res.send(guest);
  });
});

// application -------------------------------------------------------------
app.get('/', function(req, res) {
    res.sendfile('app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
// Handle html5mode
app.get('/*', function(req, res) { 
  res.sendfile('app/index.html');
});

// listen (start app with node server.js) ======================================
app.listen(80, argv.fe_ip);
console.log("App listening on port 80");