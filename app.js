if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var passport = require("passport");
var expressValidator = require("express-validator");
const check = require("express-validator/check").check;
const validationResult = require("express-validator/check").validationResult;
var LocalStrategy = require("passport-local").Strategy;
var multer = require("multer");
var cors = require("cors");

// handle file uploads
var upload = multer({ dest: "./uploads" });

var flash = require("connect-flash");
var bcrypt = require("bcryptjs");
global.mongoose = require("mongoose");
var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");

var indexRouter = require("./routes/index");
var programimageRouter = require("./routes/program-images");
var postRouter = require("./routes/posts");
var commentRouter = require("./routes/comments");
var programRouter = require("./routes/programs");
var eventRouter = require("./routes/events");
var usersRouter = require("./routes/users");
var eventcommentRouter = require("./routes/event_comments");
var contactformRouter = require("./routes/contact_forms");
var programCommentRouter = require("./routes/program_comments");
var galleryRouter = require("./routes/galleries");
var adminRouter = require("./routes/admin.router");
var contactusRouter = require("./routes/contact_us");

try {
  mongoose.connect(
    process.env.MONGODB_URI || process.env.DATABASE_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    },
    () => console.log("MongoDB connected Successfully")
  );
} catch (error) {
  console.log("could not connect to mongodDB");
}

global.moment = require("moment");

var app = express();
app.use(require("connect-flash")());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.locals.rmWhitespace = true;
app.use(cors());

app.use(expressLayouts);

app.use(express.static("./uploads"));
app.use(flash());

// app.use(adminBro.options.rootPath,router )
// app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'))

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, 'public')));

// Handle Session
app.use(
  session({
    secret: "secrect",
    saveUninitialized: true,
    resave: true,
  })
);

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator

app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift();
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postRouter);
//This is for Comments
app.use("/posts", commentRouter);

app.use("/events", eventRouter);
app.use("/programs", programRouter);

//This is for eventcomments
app.use("/events", eventcommentRouter);
//for contact form
app.use("/contact_form", contactformRouter);
app.use("/galleries", galleryRouter);
app.use("/programs", programCommentRouter);
app.use("/programs", programimageRouter);
app.use("/contactus", contactusRouter);

app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
