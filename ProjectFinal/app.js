//goi cac package can thiet
var express = require('express'); //call express
var app = express();  // define our app using express
var bodyParser = require('body-parser');  //get body-parser
var morgan = require('morgan');     //used to see request
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;  //set the port for our app
var jwt = require('jsonwebtoken');

var authRoutes = require('./routes/auth');
var profileRoutes = require('./routes/profile');
var passportSetup = require('./config/passport-setup');
var keys = require('./config/keys');
var cookieSession = require('cookie-session');
const passport = require('passport');

var User = require('./models/user');

//super secret for creating tokens, student can change
var superSecret = 'ilovescotchscotchscotchscotch';

//app configuration ------------------
//use body parser so we can grab information form post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure our app to handle cors requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// log all requests to the console 
app.use(morgan('dev'));

mongoose.Promise = global.Promise;
// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

//create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});
//
mongoose.set('useCreateIndex', true);
//route for out api
//=====================
//basic route for the home page
// app.get('/', function (req, res) {
//     res.send('Welcome to the home page!');
// });

// get an instance of the express router 
var apiRouter = express.Router();

//route to authentication a user (POST http://localhost:8080/api/authenticate)
apiRouter.post('/authenticate', function (req, res) {
    //find the user
    User.findOne({
        username: req.body.username
    }).select('name username password').exec(function (err, user) {
        if (err) throw err;
        //no user with that username was found
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            //check if password matches
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // if user is found and password is right
                //create a token
                var token = jwt.sign({
                    name: user.name,
                    username: user.username
                }, superSecret, {
                    expiresIn: '24h'  //expires in 24 hours               
                });
                //return the information including token as JSON
                res.json({
                    success: true,
                    message: 'User da duoc cap phat token!',
                    token: token
                });
            }
        }
    });
});
//doan code nay khong cho phep lam gi ma k co token
//route middlewar to verify a token
// apiRouter.use(function (req, res, next) {
//     //do logging
//     console.log('Dang lam tren App!');

//     //check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//     //decode token
//     if (token) {
//         //verifies secret and checks exp
//         jwt.verify(token, superSecret, function (err, decoded) {
//             if (err) {
//                 return res.json({ success: false, message: 'Failed to authentication token.' });
//             } else {
//                 //if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next(); //make sure we go to the next routes and don't stop here
//             }

//         });
//     } else {
//         //if there is no token
//         //return an HTTP response of 403 (access forbidden) and an error message
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });

//check token code stop here
//test route to make sure eveything is working
//accessed at GET http://localhost:8080/api


apiRouter.get('/', function (req, res) {
    res.json({ message: 'Restful API! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES --- 
// all of our routes will be prefixed with /api 
app.use('/api', apiRouter);
// on routes that end in /users
// -------- 
apiRouter.route('/users')
    // create a user (accessed at POST http://localhost:8080/api/users) 
    .post(function (req, res) {
        // create a new instance of the User model 
        var user = new User();
        // set the users information (comes from the request) 
        user.name = req.body.name;
        user.img = req.body.img;
        user.phone = req.body.phone;
        user.email = req.body.email;
        user.username = req.body.username;
        user.password = req.body.password;
        user.role = req.body.role;
        // save the user and check for errors 
        user.save(function (err) {
            if (err) {
                // duplicate entry 
                if (err.code == 11000)
                    return res.json({
                        success: false, message: 'A user with that username already exists.'
                    }); else return res.send(err);
            }
            res.json({ message: 'User created!' });
        });
    });
apiRouter.route('/users')
    // more routes for our API will happen here
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) return res.send(err);
            //return the users
            res.json(users);
        });
    });

apiRouter.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) return res.send(err);
            res.json(user);
        })
    })

// update the user with this id 
apiRouter.route('/users/:user_id')
    .put(function (req, res) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) return res.send(err);

            // set the new user information if it exists in the request 
            if (req.body.name) user.name = req.body.name;
            if (req.body.img) user.img = req.body.img;
            if (req.body.phone) user.phone = req.body.phone;
            if (req.body.email) user.email = req.body.email;
            if (req.body.address) user.address = req.body.address;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
            if (req.body.role) user.role = req.body.role;

            // save the user
            user.save(function (err) {
                if (err) return res.send(err);

                // return a message
                res.json({ message: 'User updated!' });
            });
        });
    });

apiRouter.route('/users/:user_id')
    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err) return res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });



// START THE SERVER // ===============================
app.listen(port);
console.log('Port can dung la: ' + port);

//Kết thúc chương trình phần 1