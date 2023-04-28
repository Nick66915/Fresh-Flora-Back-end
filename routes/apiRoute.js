const express = require("express");
const cors = require("cors");
const api_route = express();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const verifyToken = require("../middleware/userAuth");

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

api_route.use(cors());
api_route.use(bodyParser.json());
api_route.use(bodyParser.urlencoded({ extended: true }));

const apiController = require("../controller/ApiController");

api_route.get("/all-slider", apiController.allSlider);
api_route.get("/delete-product", apiController.deleteProduct);
api_route.get("/all-product", apiController.all_product);
api_route.post("/post-address", apiController.add_address);
api_route.get("/all-address", apiController.getAllAddress);
api_route.get("/all-categroy", apiController.all_category);
api_route.get("/product-by-categroy", apiController.productByCategory);
api_route.get("/by-id-categroy", apiController.by_id_category);
api_route.get("/get-product-by-id", apiController.get_product_by_id);
api_route.get("/all-vendor-product", apiController.all_seller_product);
api_route.get("/order-by-vendor-id", apiController.order_by_vendor);
api_route.get("/order-by-userId", apiController.order_by_user);
api_route.get("/approve-order", apiController.approve_order);
api_route.post("/users/register", apiController.register_user);
api_route.post("/change-password", apiController.ChangePassword);
api_route.post("/users/login", apiController.user_loin);
api_route.get("/product-details", apiController.product_details);

api_route.post("/send-otp", apiController.sendOtpEmail);
api_route.post("/post-order", apiController.post_order);
api_route.post("/send-verify", apiController.signupVerfication);
api_route.post("/contact-us", apiController.contact_us);
api_route.post(
  "/post-product",
  upload.single("images"),
  apiController.post_product
);
api_route.post(
  "/edit-product",
  upload.single("images"),
  apiController.postEditProduct
);

// search Api

api_route.get("/product-search", apiController.searchProductApi);
api_route.get("/order-details", apiController.order_details);


module.exports = api_route;
