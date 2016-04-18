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

mongoose.connect('mongodb://' + argv.be_ip + ':8080/my_database');
app.use('/app', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(logErrors);
//app.use(clientErrorHandler);

// Error handling =================

function logErrors(err, req, res, next) {
  console.error(err.stack);
  sendEmail('Server error', err.toString());
  next(err);
}

// function clientErrorHandler(err, req, res, next) {
//   if (req.xhr) {
//     res.status(500).send({ error: err });
//   } else {
//     next(err);
//   }
// }

// Define Schema

function getIfInvited(value) {
    if (value === 'yes') {
        return value;
    }
}

function getIfNotUnknown(value) {
    if (value !== 'unknown') {
        return value;
    }
}

var GuestSchema = new Schema({
    _id : {type: String},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, select: false},
    welcomeMsg: {type: String},
    plusOne: {type: String},
    gsy_invite: {type: String, get: getIfInvited},
    sf_invite: {type: String, get: getIfInvited},
    sc_invite: {type: String, get: getIfInvited},
    gsy_response: {type: String, get: getIfNotUnknown},
    sf_response: {type: String, get: getIfNotUnknown},
    sc_response: {type: String, get: getIfNotUnknown},
    address: {type: String, select: false},
    phone: {type: String, select: false},
    relationship: {type: String, select: false},
    domiciled: {type: String, select: false}
}, {strict: true});

GuestSchema.set('toObject', { getters: true });
GuestSchema.set('toJSON', { getters: true });

// define model =================
var Guest = mongoose.model('Guest', GuestSchema);

// routes ======================================================================

// api ---------------------------------------------------------------------

function sendEmail(subject, body, res) {
    Sendgrid.send(
        {
            from: 'mattandtamaraswedding@gmail.com',
            to: 'mattandtamaraswedding@gmail.com',
            subject: subject,
            text: body
        }, 
        function (err, json) {
            if (err) {
                console.log(err);
                if (res) {
                    res.status(500).send({ error: err });
                }
            } else {
                console.log(json);
                if (res) {
                    res.json('email sent');
                }
            }
        }
    ); 
}

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
    
    sendEmail(subject, body, null)  
}

app.post('/api/guests/unknown', function(req, res) {
    var subject = 'Wrong email for ' + req.body.name;
    var body = req.body.name + '\'s email is ' + req.body.email;
    sendEmail(subject, body, res); 
});

function updateGuestRSVP(dbGuest, sentGuest) {
    var update = sentGuest.gsy_response;
    if ((update === 'yes') || (update === 'no')) {
        dbGuest.gsy_response = update;
    }
    update = sentGuest.sc_response;
    if ((update === 'yes') || (update === 'no')) {
        dbGuest.sc_response = update;
    }
    update = sentGuest.sf_response;
    if ((update === 'yes') || (update === 'no')) {
        dbGuest.sf_response = update;
    }
    dbGuest.save();
}

app.put('/api/guests', function(req, res) {
    var guests = req.body;
    var updatedGuests = [];
    var count = guests.length;
    if (!count) {
        res.status(500).json('no guests sent');
    }
    guests.forEach(function(guest) {
        var id = guest._id;
        if (!id) {
            res.status(500).json('guest with no id sent');
            return;
        }
        delete guest._id;
        Guest.findById(id, guest, function(err, doc) {
            if (err) {
                res.stats(500).send({error: err});
            } else if (!doc) {
                res.status(500).send({error: 'no guest found with id ' + req.params.guest_id});
            } else {
                count--;
                updateGuestRSVP(doc, guest);          
                updatedGuests.push(doc);
                if (count === 0) {
                    sendRsvpEmail(updatedGuests);
                    res.send({updated: updatedGuests});
                }
            }
        });
    }, null);
});

// Get guest by email
app.get('/api/guests', function(req, res) {
    if (req.query && req.query.email) {
        Guest.findOne({email: req.query.email}, function(err, guest) {
            if (err) {
                res.status(500).send({error: err});
            } else if (!guest) {
                res.status(500).send({error: 'no guest found with email ' + req.query.email});
            } else {
                res.json(guest)
            }
        });
        return;
    }
    res.status(500).json('no guest email specified');
});

// Get guest by id
app.get('/api/guests/:guest_id', function(req, res){
  return Guest.findById(req.params.guest_id, function(err, guest) {
    if (err) {
        res.status(500).send(err);
    } else if (!guest) {
        res.status(500).send({error: 'no guest found with id ' + req.params.guest_id});
    }
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