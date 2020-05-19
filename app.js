const express = require("express");
const socket = require("socket.io");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const PORT = process.env.PORT || 3000;
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var io = socket(
  app.listen(PORT, function () {
    console.log("ok");
  })
);

//Instance of the Socket passed by individual Client.CallBack function
io.on("connection", function (socket) {
  //Each Client with Unique ID
  const sessionID = socket.id;
  console.log(sessionID);

  //Awaits for this to trigger from Front-End "Click"Listener
  socket.on("chat", function (data) {
    io.sockets.emit("chat", data);
  });
});

app.get("/home", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/assistant", function (req, res) {
  res.sendFile(__dirname + "/assistant.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.ejs");
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});

app.get("/payment", function (req, res) {
  res.sendFile(__dirname + "/payment.html");
});

app.get("/companyInfo", function (req, res) {
  res.sendFile(__dirname + "/companyInfo.html");
});

app.get("/FAQ", function (req, res) {
  res.sendFile(__dirname + "/Faq.html");
});

app.get("/contactUs", function (req, res) {
  res.sendFile(__dirname + "/contactUs.html");
});

app.get("/customerSupport", function (req, res) {
  res.sendFile(__dirname + "/customerSupport.html");
});

app.post("/contactUs", function (req, res) {
  const output = `
    <h1>You have a new feedback</h1>
    <ul>  
      <h3>Full Name: ${req.body.name}</h3>
      <h3>Full Email: ${req.body.email}</h3>
      <h3>Order Number: ${req.body.orderNumber}</h3>
    </ul>
    <h1>The Subject</h3>
    <h3>${req.body.subject}</h1>
  `;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sziacustomer@gmail.com",
      pass: "Sziaszia12",
    },
  });

  var mailOptions = {
    from: req.body.email,
    to: "TEAMSZIA@GMAIL.COM",
    subject: "Costumers Email",
    html: output,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.sendFile(__dirname + "/failed.html", { msg: "email sent" });
    } else {
      console.log("Email sent: " + info.response);
      res.sendFile(__dirname + "/success.html", { msg: "email sent" });
    }
  });
});
//bodyparser
app.use(express.urlencoded({ extended: false }));

const db = require("./config/keys").mongoURI;
require("./config/passport")(passport);

// Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//connect mangodb using mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoo bd connected"))
  .catch(() => console.log(err));

//ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/index"));
app.use("/users", require("./routes/users"));

//app.listen(PORT, console.log(`we are live on ${PORT}`));
