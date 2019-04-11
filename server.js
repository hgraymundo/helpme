'use strict'

const
  express     =   require('express'),
  app         =   express(),
  bodyParser  = require('body-parser'),
  morgan      = require('morgan'),
  cors        = require('cors'),
  validation    = require('express-validator'),
  env         = require('./configuration/config'),
  passport   = require('passport'),
  session    = require('express-session'), //basic configuration for variables
  cookieParser = require('cookie-parser'),
  Sequelize = require('sequelize'),
  favicon = require('express-favicon');


// CONFIGURATIONS
//CORS Cross-origin resource sharing
// allows restricted resources on a web page to be requested from another domain
// app.use(cors({ origin: [
//   "http://localhost:4200"
// ], credentials: true})); // Enable for angular client
app.use(cors());
// 
app.use(favicon(__dirname + '/public/img/favicon-32x32.png'));
// setup bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//HTTP request logger middleware for node.js
app.use(morgan('dev'));
//add validation support
app.use(validation());
// setup view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// SETUP static files
app.use(express.static(__dirname + '/public'));
//route base
app.get("/", (req, res) => {
  res.json({ message: "Welcome to API BASIC TEMPLATE" });
});
// setup Sequelize
var models = require("./models");
//Sync Database
models.sequelize.sync({force: false }).then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});
// setup storage session
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sequelize = new Sequelize(
"6H0rGKVAeP",
"6H0rGKVAeP",
"f93vwsCH60", {
    "dialect": "mysql",
    "host": "remotemysql.com",
    port: 3306
});

var myStore = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 6 * 10000,
    expiration: 30*10000
})
//
app.use(cookieParser())
// setup session
app.use(session({
  name: 'site-cookie',
  secret: 'keyboard cat',
  store: myStore,
  resave: false,
  saveUninitialized: false
  // saveUninitialized: false,
  // cookie: {
  //   maxAge: 30*10000
  // }
}))

app.use(function(req, res, next){
  // all the stuff from the example
  console.log("GET SESSION")
  console.log(req.session.passport)
  if (req.session.passport) {
    res.locals.user = req.session.passport
  }
  next();
});

myStore.sync();

require('./configuration/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());
//add more routes
var login   = require('./route/login.js')(app);
var signup  = require('./route/signup.js')(app);
var dashboard  = require('./route/dashboard.js')(app);
var user  = require('./route/user.js')(app);
var alert  = require('./route/alert.js')(app);


//run server
app.listen(env.PORT, ()=> {
  console.log("Server is running on "+ env.PORT +" port");
});
