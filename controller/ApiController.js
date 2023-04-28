const path = require("path");
const ejs = require("ejs");
const Admin = require("../model/adminModel");
const mongoose = require("mongoose");
const Slider = require("../model/sliderModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const Order = require("../model/orderModal");
const Otp = require("../model/otp");

const User = require("../model/userModel");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Address = require("../model/addressModal");
const { REFUSED } = require("dns");
// const { config } = require("process");
const key = "hellosir";

// secure Password
const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, key);
    return token;

    //
  } catch (error) {
    console.log(error.message);
  }
};
// console.log(create_token('hello'));

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};
const allSlider = async (req, res) => {
  try {
    const allSliderData = await Slider.find({ is_active: "1" });
    // console.log(allSliderData);

    res.status(200).send({ success: true, slider: allSliderData });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};
const all_product = async (req, res) => {
  try {
    const all_product_data = await Product.find({ is_active: "1" });
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: all_product_data });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};
const product_details = async (req, res) => {
  console.log(req.query.id);
  try {
    const product_data = await Product.find({ product_url: req.query.id });
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: product_data });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const all_category = async (req, res) => {
  try {
    const all_category_data = await Category.find({ is_active: "1" });
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: all_category_data });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const register_user = async (req, res) => {
  try {
    const password = await securePassword(req.body.password);

    const user = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: password,
      salt_password: req.body.password,
      type: req.body.type,
      address: req.body.address,
      city: req.body.city,
      phone_number: req.body.phone_number,
      status: 1,
    });
    const userData = await User.findOne({
      email: req.body.email,
      phone_number: req.body.phone_number,
    });
    if (userData) {
      res
        .status(200)
        .send({ success: false, msg: "Email or Phone Number Already Exists" });
    } else {
      const userKaData = await user.save();
      const email = req.body.email;
      const userDataVerfiy = await User.findOne({ email: email });
      if (userDataVerfiy) {
        const randomString = randomstring.generate();
        // const updateUserData = await User.updateOne(
        //   { email: email },
        //   { $set: { token: randomString } }
        // );
        sendResetPasswordMail(
          userDataVerfiy.name,
          userDataVerfiy.email,
          userDataVerfiy._id
        );
        const user_data = {
          name: userDataVerfiy.name,
          email: userDataVerfiy.email,
          phone_number: userDataVerfiy.phone_number,
          address: userDataVerfiy.address,
          city: userDataVerfiy.city,
          type: userDataVerfiy.type,
          is_verified: userDataVerfiy.is_verified,
        };
        res.status(200).send({
          success: true,
          message: "Please Check Your Email To Verify Your Account",
          data: user_data,
        });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error.message);
  }
};

// login Function
const user_loin = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const type = req.body.type;
    const password = req.body.password;
    const userData = await User.findOne({ email: email, type: type });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        const tokenData = await create_token(userData._id);
        // console.log(tokenData);

        const userResult = {
          id: userData?._id,
          name: userData?.name,
          type: userData?.type,
          email: userData?.email,
          address: userData?.address,
          phone_number: userData?.phone_number,
          city: userData?.city,
          is_verified: userData?.is_verified,

          token: tokenData,
        };
        const response = {
          succes: true,
          msg: "User Details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res.status(200).send({ success: false, msg: "Invalid Credentials" });
      }
    } else {
      res.status(200).send({ success: false, msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// product by category
const productByCategory = async (req, res) => {
  console.log(req.body.categroy_id);
  try {
    var sendData = [];
    const cate_id = req.query.id;
    console.log(cate_id);

    const Cat_data = await Product.find({
      categroy_id: cate_id,
      is_active: "1",
    });
    const response = {
      succes: true,
      msg: "Product Data",
      data: Cat_data,
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ succes: false, msg: error.message });
  }
};

// send Mail Function Code
const sendResetPasswordMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: "smtp.mailtrap.io",
      // port: 2525,
      // auth: {
      //   user: "950f02a6bedd48",
      //   pass: "2bca04733a679e",
      // },

      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "luciferlordsa321@gmail.com",
        pass: "ydjiubgveiksncfw",
      },
    });

    const emailTemplate = path.join(
      __dirname,
      "../views/pages/singupEmailtempate.ejs"
    );
    const data = await ejs.renderFile(emailTemplate, {
      name,
      email,

      user_id,
    });

    var mailOptions = {
      from: "luciferlordsa321@gmail.com",
      to: email,
      bcc: "neet18101@gmail.com",
      subject: "Verify Your Account",
      html: data,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// contact us

const contactus = async (name, email, subject, message) => {
  try {
    console.log(name);
    const transporter = nodemailer.createTransport({
      // host: "smtp.mailtrap.io",
      // port: 2525,
      // auth: {
      //   user: "950f02a6bedd48",
      //   pass: "2bca04733a679e",
      // },

      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "luciferlordsa321@gmail.com",
        pass: "ydjiubgveiksncfw",
      },
    });

    // const emailTemplate = path.join(
    //   __dirname,
    //   "../views/pages/singupEmailtempate.ejs"
    // );
    // const data = await ejs.renderFile(emailTemplate, {
    //   name,
    //   email,

    //   user_id,
    // });

    const data = [
      ["Name", "email", "subject", "message"],
      [name, email, subject, message],
    ];

    let tableMarkup = "<table>";
    for (let row of data) {
      tableMarkup += "<tr>";
      for (let cell of row) {
        tableMarkup += `<td>${cell}</td>`;
      }
      tableMarkup += "</tr>";
    }
    tableMarkup += "</table>";

    var mailOptions = {
      from: "luciferlordsa321@gmail.com",
      to: email,
      bcc: "neet18101@gmail.com",
      subject: "Verify Your Account",
      html: `<h1>Table Example</h1>${tableMarkup}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const contact_us = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const name = req.body.name;
    const subject = req.body.subject;
    const message = req.body.message;

    contactus(name, email, subject, message);
    res.status(200).send({
      success: true,
      message: "Thank-you",
    });
  } catch (error) {
    console.log(error.message);
  }
};

// send verifvation link

const signupVerfication = async (req, res) => {
  try {
    const email = req.body.email;
    const userDataVerfiy = await User.findOne({ email: email });
    if (userDataVerfiy) {
      const randomString = randomstring.generate();
      const updateUserData = await User.updateOne(
        { email: email },
        { $set: { token: randomString } },
        { $set: { is_verified: 2 } }
      );
      sendResetPasswordMail(
        userDataVerfiy.name,
        userDataVerfiy.email,
        randomString
      );

      const userData = {
        name: userDataVerfiy.name,
        email: userDataVerfiy.email,
      };
      console.log(userData);
      res.status(200).send({
        message: "Please Check Your Email To Verify  Your Account",
        data: userData,
      });
    } else {
      res.status(400).send({ message: "Email is not exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
//  Add product

const post_product = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    // var arrImage = [];
    // for (let i = 0; i < req.file.length; i++) {
    //   arrImage[i] = req.file[i].filename;
    // }
    var product = new Product({
      vendor_id: req.body.vendor_id,
      type: req.body.type,
      product_id: req.body.product_id,
      categroy_id: req.body.categroy_id,
      product_name: req.body.product_name,
      sub_categroy_id: req.body.sub_categroy_id,
      description: req.body.description,
      product_url: req.body.product_url,
      price: req.body.price,
      location: req.body.location,
      discount: req.body.discount,
      images: req.file.filename,
    });

    const product_data = product.save();
    if (product_data) {
      res.status(200).send({ succes: true, msg: "Product Add Successfully" });
    } else {
      res.status(400).send({ succes: false, message: "Product Add Fail" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const all_seller_product = async (req, res) => {
  try {
    const all_vendor_product_data = await Product.find({
      vendor_id: req.query.vendor_id,
      is_active: 1,
    });
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: all_vendor_product_data });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Edit Product

const postEditProduct = async (req, res) => {
  try {
    if (req.file) {
      const updateCategory = await Product.findByIdAndUpdate(
        { _id: req.body.product_id },
        {
          $set: {
            vendor_id: req.body.vendor_id,
            product_id: req.body.product_id,
            categroy_id: req.body.categroy_id,
            product_name: req.body.product_name,
            sub_categroy_id: req.body.sub_categroy_id,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            images: req.file.filename,
          },
        }
      );
    } else {
      const updateCategory = await Product.findByIdAndUpdate(
        { _id: req.body.product_id },
        {
          $set: {
            vendor_id: req.body.vendor_id,
            product_id: req.body.product_id,
            categroy_id: req.body.categroy_id,
            product_name: req.body.product_name,
            sub_categroy_id: req.body.sub_categroy_id,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
          },
        }
      );
    }
    res.setHeader("Content-Type", "text/html");

    res.status(200).send({ success: true, msg: "product update Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

// get productById

const get_product_by_id = async (req, res) => {
  console.log(req.query.id);
  try {
    const get_productById = await Product.findOne({
      is_active: 1,
      _id: req.query.id,
    });
    console.log(get_product_by_id);
    const getData = {
      vendor_id: get_productById.vendor_id,
      product_id: get_productById.product_id,
      categroy_id: get_productById.categroy_id,
      product_name: get_productById.product_name,
      product_url: get_productById.product_url,
      sub_categroy_id: get_productById.sub_categroy_id,
      description: get_productById.description,
      price: get_productById.price,
      discount: get_productById.discount,
      location: get_productById.location,
    };
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: getData });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// delete Product
const deleteProduct = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Product.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: 2 } }
    );
    res.status(200).send({ success: true, msg: "product delete Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};
// Add address

const add_address = async (req, res) => {
  try {
    // var arrImage = [];
    // for (let i = 0; i < req.file.length; i++) {
    //   arrImage[i] = req.file[i].filename;
    // }
    var addAdress = new Address({
      title: req.body.title,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      user_type: req.body.user_type,
      user_id: req.body.user_id,
      address: req.body.address,
      is_active: 1,
    });

    const address_data = addAdress.save();
    if (address_data) {
      res.status(200).send({ succes: true, msg: "Address Add Successfully" });
    } else {
      res.status(400).send({ succes: false, message: "Product Add Fail" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getAllAddress = async (req, res) => {
  console.log(req.query.id);

  try {
    const addressId = req.query.id;
    // console.log(removeID);
    const address_Data = await Address.find({ user_id: addressId });
    res.status(200).send({ success: true, data: address_Data });
  } catch (error) {
    console.log(error.message);
  }
};

// Order Genrate

const post_order = async (req, res) => {
  console.log(req.body);
  const {
    products,
    user_id,
    user_email,
    address,
    type,
    phone_number,
    total,
    status,
    order_type,
  } = req.body;

  try {
    console.log(products);

    const totalPrice = req.body.total;
    const newOrder = new Order({
      products,
      user_id,
      user_email,
      phone_number,
      address,
      type,
      total,
    });
    const savedOrder = await newOrder.save();
    res.status(200).send({ succes: true, data: savedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get Order by Vendor_id

const getAllOrder = async (req, res) => {
  try {
    const get_productById = await Product.findOne({
      is_active: 1,
      _id: req.query.id,
    });
    console.log(get_product_by_id);
    const getData = {
      vendor_id: get_productById.vendor_id,
      product_id: get_productById.product_id,
      categroy_id: get_productById.categroy_id,
      product_name: get_productById.product_name,
      product_url: get_productById.product_url,
      sub_categroy_id: get_productById.sub_categroy_id,
      description: get_productById.description,
      price: get_productById.price,
      discount: get_productById.discount,
      location: get_productById.location,
    };
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: getData });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Show order for vendor_id
const order_by_vendor = async (req, res) => {
  console.log(req.body);
  try {
    const vendorId = req.query.id;

    const get_order_vendor = await Order.find({
      "products.vendor_id": vendorId,
    });
    res.status(200).send({
      success: true,
      msg: "Vendor Data Get Successfully",
      data: get_order_vendor,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// delivery order
const approve_order = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Order.findByIdAndUpdate({ _id: removeID }, { $set: { status: "0" } });
    res.status(200).send({
      success: true,
      msg: "Order Approve Succesfully",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const by_id_category = async (req, res) => {
  try {
    const byIdData = await Category.find({
      is_active: "1",
      categoryUrl: req.query.id,
    });
    // console.log(allSliderData);

    res.status(200).send({ success: true, data: byIdData });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// search Api

const searchProductApi = async (req, res) => {
  try {
    const { key, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.q;
    const searchData = await Product.find({
      is_active: 1,
      product_name: { $regex: searchQuery, $options: "i" },
    });
    res.status(200).send({ success: true, data: searchData });
  } catch (error) {
    console.log(error.message);
  }
};

//  order by user id
const order_by_user = async (req, res) => {
  console.log(req.body);
  try {
    const id = req.query.id;

    const get_order_vendor = await Order.find({
      user_id: id,
    });
    res.status(200).send({
      success: true,
      msg: "User Data Get Successfully",
      data: get_order_vendor,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Change Passoword

const sendOtpEmail = async (req, res) => {
  console.log(req.body.email);
  try {
    let data = await User.find({ email: req.body.email });
    console.log(data);
    const response = {};
    if (data) {
      let otpcode = Math.floor(Math.random() * 10000 + 1);
      let otpData = new Otp({
        email: req.body.email,
        code: otpcode,
        expireIn: new Date().getTime() + 300 * 1000,
      });

      let otpResponse = await otpData.save();
      otpMail(otpResponse.email, otpData.code);
      if (otpResponse) {
        res.status(200).send({ success: true, msg: "Please Check your email" });
      }
    } else {
      res.status(200).send({ success: false, msg: "Email I'd No Exist" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// sendOtpMail
const otpMail = async (email, code) => {
  console.log(email);
  try {
    const transporter = nodemailer.createTransport({
      // host: "smtp.mailtrap.io",
      // port: 2525,
      // auth: {
      //   user: "950f02a6bedd48",
      //   pass: "2bca04733a679e",
      // },

      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "luciferlordsa321@gmail.com",
        pass: "ydjiubgveiksncfw",
      },
    });

    var mailOptions = {
      from: "luciferlordsa321@gmail.com",
      to: email,
      bcc: "neet18101@gmail.com",
      subject: "Verify Your Account",
      html: `<h1>Don't Share OTP</h1>${code}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const ChangePassword = async (req, res) => {
  console.log(req.body.email);
  console.log(req.body.code);
  try {
    let data = await Otp.find({ email: req.body.email, code: req.body.code });
    if (data) {
      let currentTime = new Date().getTime();
      let diff = data.expireIn - currentTime;
      if (diff < 0) {
        res.status(498).send({ succes: false, msg: "Token Expire" });
      } else {
        const password = await securePassword(req.body.password);
        console.log(password, "hello undifined");

        const userData = await User.updateOne(
          { email: req.body.email.toLowerCase() },
          { $set: { password: password } },
          { $set: { salt_password: req.body.password } }
        );

        if (userData) {
          res
            .status(200)
            .send({ success: true, msg: "Password Update Successfully" });
        }
      }
    } else {
      res.status(400).send({ success: false, msg });
    }
  } catch (error) {
    console.log(error);
  }
};

// order details
const order_details = async (req, res) => {
  try {
    const orderId = req.query.id;
    const orderDetailsData = await Order.findById({
      _id: orderId,
      products: {},
    });
    console.log(orderDetailsData);

    if (orderDetailsData) {
      res
        .status(200)
        .send({
          success: true,
          data: orderDetailsData,
          msg: "Password Update Successfully",
        });
      // res.render("pages/orderDetails", {
      //   admin: adminData,
      //   data: orderDetailsData,
      // });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  allSlider,
  register_user,
  user_loin,
  all_product,
  all_category,
  productByCategory,
  signupVerfication,
  post_product,
  all_seller_product,
  deleteProduct,
  postEditProduct,
  add_address,
  get_product_by_id,
  getAllAddress,
  post_order,
  order_by_vendor,
  approve_order,
  product_details,
  by_id_category,
  searchProductApi,
  order_by_user,
  contact_us,
  ChangePassword,
  sendOtpEmail,
  order_details,
};
