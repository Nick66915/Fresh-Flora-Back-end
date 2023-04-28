const express = require("express");
var cors = require("cors");
var path = require("path");
var ejs = require("ejs");

const bodyParser = require("body-parser");
// const Employee = require('./controller/employeeController')

const app = express();
// app.get("/", (req, res) => {
//   res.send("this from backend");
// });

var dbconnection = require("./db");
// const Product = require("./models/productModel");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine set
app.set("view engine", "ejs");
app.set("views", "./views");

// backend
// Serve the React build folder

// const employeeRoutes = require('./routes/employeeRoutes')

// app.use('/',employeeRoutes.employeeRoutes);

// For User Routes
const adminRoute = require("./routes/adminRoute");
app.use("/", adminRoute);

//  Api Route
const apiRoute = require("./routes/apiRoute");
app.use("/api", apiRoute);

const port = 5000;
app.listen(port, () => console.log("nodejs Server start"));
