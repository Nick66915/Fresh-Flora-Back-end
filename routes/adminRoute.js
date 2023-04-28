const express = require("express");
const cors = require("cors");
const admin_routes = express();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
const flash = require("connect-flash");

// session use
admin_routes.use(
  session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true,
  })
);

// flash message
admin_routes.use(flash());
// middileware
const auth = require("../middleware/auth");

// image store
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/HomeSlider"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

// view engine set
admin_routes.use(express.static("public"));
admin_routes.use("/css", express.static(__dirname + "public/css"));
admin_routes.use("/img", express.static(__dirname + "public/imgages"));
// admin_routes.use("/userimage", express.static(__dirname + "public/userimage"));
admin_routes.use("/js", express.static(__dirname + "public/js"));
admin_routes.use("/plugins", express.static(__dirname + "public/plugins"));
admin_routes.use("/vendor", express.static(__dirname + "public/vendor"));
admin_routes.use(
  "/HomeSlider",
  express.static(__dirname + "public/HomeSlider")
);
admin_routes.set("view engine", "ejs");
admin_routes.set("views", "./views");

const bodyParser = require("body-parser");
admin_routes.use(cors());
admin_routes.use(bodyParser.json());
admin_routes.use(bodyParser.urlencoded({ extended: true }));

const adminController = require("../controller/AdminController");

admin_routes.get("/", auth.isLogout, adminController.login);
admin_routes.post("/post", adminController.verifiyLogin);
admin_routes.get("/dashboard", auth.isLogin, adminController.dashboard);

// Default url
// admin_routes.get('*',function(req,res){
//   res.redirect('/admin')

// })



// category Routes

admin_routes.get("/category", auth.isLogin, adminController.all_category);
admin_routes.post(
  "/add-category",
  upload.single("category_images"),
  adminController.addCategory
);
admin_routes.get(
  "/delete-category",
  auth.isLogin,
  adminController.deleteCategroy
);
admin_routes.get("/edit-category", auth.isLogin, adminController.editCategroy);
admin_routes.post(
  "/edit-category",
  upload.single("slider"),
  adminController.postEditCategory
);

// Sub-categroy

admin_routes.get("/sub-category", adminController.sub_categroy);
admin_routes.get("/edit-sub-category", adminController.editSubCategroy);
admin_routes.post(
  "/sub-category",
  upload.single("subCategory"),
  adminController.create_sub_categroy
);
admin_routes.post(
  "/edit-subcategroy",
  upload.single("slider"),
  adminController.postEditSubCategory
);

// product Routes
admin_routes.get("/add-product", adminController.add_product);
admin_routes.post(
  "/add-product",
  upload.single("images"),
  adminController.post_product
);

admin_routes.get("/all-product", adminController.all_product);

admin_routes.get("/delete-product", adminController.deleteProduct);
admin_routes.get("/edit-product", adminController.editProduct);
admin_routes.post(
  "/edit-product",
  upload.single("image"),
  adminController.postEditProduct
);

// verify user
admin_routes.get("/verify-user", adminController.verifiySingupLoad);

// seller controller
admin_routes.get("/all-seller", adminController.all_seller);
admin_routes.get("/seller-approve", adminController.seller_approve);
admin_routes.get("/reject-approve", adminController.reject_approve);

admin_routes.get("/delete-sub-category", adminController.delete_sub_catgory);
admin_routes.get(
  "/all-seller-product",
  adminController.all_product_add_by_seller
);
admin_routes.get("/approve-product", adminController.approve_product);  
admin_routes.get("/reject-product", adminController.reject_product);
admin_routes.get("/delete-product", adminController.delete_product);

// Order Routes
admin_routes.get("/all-order", adminController.all_Order);
admin_routes.get("/approve-order", adminController.approve_order);
admin_routes.get("/delete-order", adminController.delete_order);
admin_routes.get("/delivery-order", adminController.delivery_order);


// User Routes
admin_routes.get("/all-user", adminController.all_user);
admin_routes.get("/order-details", adminController.order_details);
admin_routes.get("/edit-admin", adminController.edit_profile);
admin_routes.post("/change-admin", adminController.admin_password);


module.exports = admin_routes;
