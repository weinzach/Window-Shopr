//Module dependencies.
var express = require('express');
var http = require('http');
var passport = require('passport');
var path = require('path');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var socketio = require('socket.io');
var ejs = require('ejs');

var config = require("./crypto.json");

//Load Necessary Config Files
var node_algorithm = config["algorithm"];
var node_password = config["password"];
var node_secret = config["secret"];

//AES256 Crypto Functions
var crypto = require('crypto'),
    algorithm = node_algorithm,
    password = node_password;

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

//Connect to Database
mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
mongoose.connect('mongodb://localhost/Shoppr');
var Schema = mongoose.Schema;

// all environments
var app = express();
app.use(require('express-session')({
    key: 'session',
    secret: node_secret,
    city: '',
    region: '',
    store: require('mongoose-session')(mongoose)
}));
app.set('port', process.env.PORT || 80);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
var sess;

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//User Schema
var UserDetail = new Schema({
    email: String,
    password: String,
    name: String,
    birthday: String,
    type: String
}, {
    collection: 'userInfo'
});

//Create MongoDB models
var UserDetails = mongoose.model('userInfo', UserDetail);

//Handle User Sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

//Verify Login with User Schema
passport.use(new LocalStrategy(
    function(email, password, done) {

        process.nextTick(function() {
            UserDetails.findOne({
                    'email': email
                },
                function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    if (user.password != encrypt(password)) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
        });
    }
));

/////////////////////////
// Handle Page Routing //
/////////////////////////

app.get('/login', function(req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('pages/login', {
            page_name: "login",
            fail: false,
            login: false
        });
    }
});

app.get('/loginfailed', function(req, res, next) {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('pages/login', {
            page_name: "login",
            fail: true,
            login: false
        });
    }
});

app.get('/register', function(req, res, next) {
    res.render('pages/register', {
        page_name: "register",
        fail: 0,
        login: false
    });

});

app.get('/registerfail1', function(req, res, next) {
    res.render('pages/register', {
        page_name: "register",
        fail: 1,
        login: false
    });

});

app.get('/registerfail2', function(req, res, next) {
    res.render('pages/register', {
        page_name: "register",
        fail: 2,
        login: false
    });

});

app.get('/shop', function(req, res, next) {
    if (req.user) {
        res.render('pages/shop', {
            page_name: "shop",
            fail: false,
            login: true
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/swipe/:id', function(req, res, next) {
    var id = req.params.id; //or use req.param('id')
    if (req.user) {
        res.render('pages/swipe', {
            page_name: "swipe",
            fail: false,
            login: true,
            data: [{
                query: id
            }, {
                name: "hi1",
                img: ""
            }, {
                name: "hi1",
                img: "https://i.kinja-img.com/gawker-media/image/upload/s--pEKSmwzm--/c_scale,fl_progressive,q_80,w_800/1414228815325188681.jpg"
            }]
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/'); //Can fire before session is destroyed?
});

app.get('/', function(req, res, next) {
    sess = req.session;
    if (req.user) {
        res.render('pages/main', {
            page_name: "login",
            fail: true,
            login: true
        });
    } else {
        res.render('pages/main', {
            page_name: "login",
            fail: true,
            login: false
        });
    }
});

app.post('/auth',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/loginfailed'
    }));

app.post('/adduser', function(req, res) {
    var formData = req.body;
    for (var key in formData) {
        if (formData.hasOwnProperty(key)) {
            if (formData[key] == "") {
                res.redirect('/registerfail1');
            };
        }
    }
    UserDetails.findOne({
            'email': formData.email
        },
        function(err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                var pass = encrypt(formData.password);
                var fullName = formData.fname + " " + formData.lname;
                var usrName = formData.email;
                var bday = formData.month + "/" + formData.day + "/" + formData.year;
                var newUser = new UserDetails({
                    email: usrName,
                    password: pass,
                    name: fullName,
                    birthday: bday,
                    type: 'user'
                });
                newUser.save(function(err, newUser) {
                    if (err) return console.error(err);
                    else {
                        res.redirect('/login');
                    }
                });
            } else {
                res.redirect('/registerfail2');
            }
        });
});


//Create Server Instance on Defined Port
var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
