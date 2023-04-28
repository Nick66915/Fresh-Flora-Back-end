const mongoose = require("mongoose");

var mongooseUrl ="mongodb+srv://Nick:Mom1998@freshflora.42h26dl.mongodb.net/FreshFlora"

mongoose.connect(mongooseUrl);
var dbconnect = mongoose.connection;
dbconnect.on("error", () => {
  console.log("database Connection failed");
});
dbconnect.on("connected", () => {
  console.log("database Connection successfully");
});
module.exports = mongoose;
