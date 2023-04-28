const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const otpSchema = new mongoose.Schema({

    email:String,
    code:String,
    expireIn:Number
  
},{
    timestamps:true
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
