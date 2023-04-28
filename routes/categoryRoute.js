const express = require("express");
const cors = require("cors");
const admin_routes = express();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({extended:true}));
const adminController = require("../controller/AdminController");


category_route.post('/add-category',adminController.addCategory);

module.exports = category_route