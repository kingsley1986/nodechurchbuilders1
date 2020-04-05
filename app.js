if (process.env.NODE_ENV !==  'production') {
  const dotenv = require('dotenv').config();

}

var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
const check = require('express-validator/check').check;
const validationResult = require('express-validator/check').validationResult;
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
// handle file uploads
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
const methodOverride = require('method-override');
global.mongoose = require('mongoose');



var indexRouter = require('./routes/index');
var postRouter = require('./routes/posts');
var commentRouter = require('./routes/comments');
var programRouter = require('./routes/programs');
var eventRouter = require('./routes/events');
var usersRouter = require('./routes/users');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection
db.on('error', error => console.log(error)) 
db.once('open', () => console.log('connectd to Mongoose'))


var app = express();
app.use(require('connect-flash')());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static('./uploads'));
app.use(flash());




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));

// Handle Session
app.use(session({
  secret:'secrect',
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator 

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift()
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next) {
  res.locals.user = req.user  || null;
  next();
});


app.use(methodOverride('_method'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('', commentRouter);
app.use('/events', eventRouter);
app.use('/programs', programRouter);
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
