const path = require("path");
const ejs = require("ejs");
const Admin = require("../model/adminModel");
const Slider = require("../model/sliderModel");
const Order = require("../model/orderModal");
const Category = require("../model/categoryModel");
const subCategory = require("../model/subCategoryModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");

// Admin Pages

// user login start
const login = async (req, res) => {
  try {
    res.render("pages/login");
  } catch (error) {
    console.log(error.message);
  }
};
const verifiyLogin = async (req, res) => {
  // const  = "neet@gmail.com";
  // const  = "123456";

  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email,password);

    const adminData = await Admin.findOne({ email: email });
    // console.log(adminData)

    if (adminData) {
      // const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (adminData.password === password) {
        if (adminData.is_active === 0) {
          res.render("pages/login", { message: "Please Verify Your Email" });
        } else {
          res.setHeader("Content-Type", "text/html");
          req.session.user_id = adminData._id;

          res.redirect("/dashboard");
        }
      } else {
        res.render("pages/login", {
          message: "pages email and password incorrect",
        });
      }
    } else {
      res.render("pages/login", {
        message: "user email and password incorrect",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Dashboard Load

const dashboard = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });

    const productData = await Product.find({ is_active: 1 });
    // console.log(adminData);
    res.render("pages/dashboard", {
      admin: adminData,
      productData: productData,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Category

const all_category = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const get_allCategory = await Category.find({ is_active: 1 });
    // console.log(adminData);

    res.render("pages/allCategroy", {
      admin: adminData,
      success: " ",
      data: get_allCategory,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const addCategory = async (req, res) => {
  // console.log(req);
  try {
    const cate_data = new Category({
      categoryName: req.body.categoryName,
      categoryUrl: req.body.category_url,
      description: req.body.description,
      image: req.file.filename,
    });

    const saveData = await cate_data.save();
    if (saveData) {
      const cata = subCategory.find();
      const adminData = await Admin.findById({ _id: req.session.user_id });
      res.render("pages/allCategroy", {
        data: cata,
        admin: adminData,
        message: "sucessfully Added",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const editCategroy = async (req, res) => {
  // console.log(req.query.id);

  try {
    const editID = req.query.id;
    console.log(editID);
    const EditcategroyData = await Category.findById({ _id: editID });
    console.log(EditcategroyData);
    if (EditcategroyData) {
      const adminData = await Admin.findById({ _id: req.session.user_id });
      res.render("pages/editCategory", {
        data: EditcategroyData,
        admin: adminData,
        success: "Category Add Successfullly",
      });
    } else {
      res.setHeader("Content-Type", "text/html");
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const postEditCategory = async (req, res) => {
  try {
    if (req.file) {
      const updateCategory = await Category.findByIdAndUpdate(
        { _id: req.body.category_id },
        {
          $set: {
            categoryName: req.body.categoryName,
            categoryUrl: req.body.category_url,
            description: req.body.description,
            image: req.file.filename,
          },
        }
      );
    } else {
      const updateCategory = await Category.findByIdAndUpdate(
        { _id: req.body.category_id },
        {
          $set: {
            categoryName: req.body.categoryName,
            categoryUrl: req.body.category_url,
            description: req.body.description,
          },
        }
      );
    }
    res.setHeader("Content-Type", "text/html");

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteCategroy = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Category.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: "2" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/category");
  } catch (error) {
    console.log(error.message);
  }
};

// sub-category

const sub_categroy = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const get_allCategory = await Category.find({ is_active: 1 });
    const get_allsubCategory = await subCategory.find({ is_active: 1 });
    console.log(get_allsubCategory);

    res.render("pages/allSubCategory", {
      admin: adminData,
      data: get_allCategory,
      allsubcate: get_allsubCategory,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const create_sub_categroy = async (req, res) => {
  console.log(req.body);
  try {
    const check_sub = await subCategory.find();
    const cata = subCategory.find();
    const get_allCategory = await Category.find({ is_active: 1 });
    const get_allsubCategory = await subCategory.find({ is_active: 1 });
    const subcate = new subCategory({
      category_id: req.body.category_id,
      sub_category_name: req.body.sub_categoryName,
      sub_category_url: req.body.sub_categoryUrl,
      image: req.file.filename,
      description: req.body.description,
    });
    const sub_cate_data = await subcate.save();
    if (sub_cate_data) {
      const adminData = await Admin.findById({ _id: req.session.user_id });
      res.render("pages/allSubCategory", {
        admin: adminData,
        data: get_allCategory,
        allsubcate: get_allsubCategory,

        message: "sucessfully Added",
      });
    }
  } catch (error) {
    console.log(error.message);
  }

  // console.log(adminData);

  // res.render("pages/dashboard");
};

const editSubCategroy = async (req, res) => {
  // console.log(req.query.id);

  try {
    const editID = req.query.id;
    console.log(editID);
    const EditSubcategroyData = await subCategory.findById({ _id: editID });
    console.log(EditSubcategroyData);
    if (EditSubcategroyData) {
      const adminData = await Admin.findById({ _id: req.session.user_id });
      const get_allCategory = await Category.find({ is_active: 1 });
      res.render("pages/editSubCategory", {
        data: EditSubcategroyData,
        category: get_allCategory,
        admin: adminData,
        success: "Category Add Successfullly",
      });
    } else {
      res.setHeader("Content-Type", "text/html");
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const postEditSubCategory = async (req, res) => {
  try {
    if (req.file) {
      const updateCategory = await subCategory.findByIdAndUpdate(
        { _id: req.body.sub_category_id },
        {
          $set: {
            category_id: req.body.categroy_id,
            sub_category_name: req.body.subCatgroyName,
            sub_category_url: req.body.sub_category_url,
            description: req.body.description,
            image: req.file.filename,
          },
        }
      );
    } else {
      const updateCategory = await subCategory.findByIdAndUpdate(
        { _id: req.body.sub_category_id },
        {
          $set: {
            category_id: req.body.sub_category_id,
            sub_category_name: req.body.subCatgroyName,
            sub_category_url: req.body.sub_category_url,
            description: req.body.description,
          },
        }
      );
    }
    res.setHeader("Content-Type", "text/html");

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteSubCategroy = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await subCategory.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: "2" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/sub-category");
  } catch (error) {
    console.log(error.message);
  }
};

// Add Product

const add_product = async (req, res) => {
  try {
    const get_allCategory = await Category.find({ is_active: 1 });
    const get_allsubCategory = await subCategory.find({ is_active: 1 });
    const adminData = await Admin.findById({ _id: req.session.user_id });
    res.render("pages/addProduct", {
      admin: adminData,
      category: get_allCategory,
      subCategory: get_allsubCategory,
      success: "Category Add Successfullly",
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

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
      product_id: req.body.product_id,
      categroy_id: req.body.categroy_id,
      product_name: req.body.product_name,
      sub_categroy_id: req.body.sub_categroy_id,
      description: req.body.description,
      product_url: req.body.product_url,
      price: req.body.price,
      discount: req.body.discount,
      images: req.file.filename,
    });

    const product_data = product.save();
    if (product_data) {
      const get_allCategory = await Category.find({ is_active: 1 });
      const get_allsubCategory = await subCategory.find({ is_active: 1 });
      const adminData = await Admin.findById({ _id: req.session.user_id });
      res.render("pages/addProduct", {
        admin: adminData,
        category: get_allCategory,
        subCategory: get_allsubCategory,
        success: "Category Add Successfullly",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// product

const all_product = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const productData = await Product.find({ is_active: 1 });
    // console.log(adminData);
    res.render("pages/allProduct", {
      admin: adminData,
      productData: productData,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Delte Product

const deleteProduct = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Product.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: "2" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-product");
  } catch (error) {
    console.log(error.message);
  }
};

// editProduct

const editProduct = async (req, res) => {
  // console.log(req.query.id);

  try {
    const editID = req.query.id;
    console.log(editID);
    const EditProductData = await Product.findById({ _id: editID });
    console.log(EditProductData);
    if (EditProductData) {
      const adminData = await Admin.findById({ _id: req.session.user_id });
      const get_allCategory = await Category.find({ is_active: 1 });
      const get_allsubCategory = await subCategory.find({ is_active: 1 });

      res.render("pages/editProduct", {
        data: EditProductData,
        category: get_allCategory,
        subCategory: get_allsubCategory,
        admin: adminData,
        success: "Product Update Successfullly",
      });
    } else {
      res.setHeader("Content-Type", "text/html");
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// post Edit

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

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// verify user
const verifiySingupLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const tokenData = await User.updateOne(
      { _id: id },
      { $set: { is_verified: 1 } }
    );
    if (tokenData) {
      res.status(200).send({ message: "Verify Successfully" });
    } else {
      res.status(400).send({ message: "Token is Invalid" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// all seller

const all_seller = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const sellerData = await User.find({ type: 2, is_active: 1 });
    console.log(sellerData);
    res.render("pages/allSeller", {
      admin: adminData,
      data: sellerData,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// delete seller

const delete_seller = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await User.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: "2" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-seller");
  } catch (error) {
    console.log(error.message);
  }
};

// all product which add by seller

const all_product_add_by_seller = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const add_by_seller = await Product.find({ type: 2, is_active: 1 });
    console.log(add_by_seller);
    res.render("pages/AllSellerProduct", {
      admin: adminData,
      productData: add_by_seller,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Approve Product

const approve_product = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Product.findByIdAndUpdate(
      { _id: removeID },
      { $set: { status: "1" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-seller-product");
  } catch (error) {
    console.log(error.message);
  }
};
// Approve Product

const reject_product = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Product.findByIdAndUpdate(
      { _id: removeID },
      { $set: { status: "0" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-seller-product");
  } catch (error) {
    console.log(error.message);
  }
};

const delete_product = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Product.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: "2" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-seller-product");
  } catch (error) {
    console.log(error.message);
  }
};
// all_order
const all_Order = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const allOrderData = await Order.find({ is_active: "1" });
    const allOrderProduct = await Order.find({ products: {} });
    console.log(allOrderProduct);

    console.log(allOrderData, "order");
    res.setHeader("Content-Type", "text/html");
    res.render("pages/Order", { admin: adminData, data: allOrderData });

    // console.log(allSliderData);
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};
const approve_order = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Order.findByIdAndUpdate({ _id: removeID }, { $set: { status: "1" } });
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-order");
  } catch (error) {
    console.log(error.message);
  }
};
// delete_order

const delete_order = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Order.findByIdAndUpdate(
      { _id: removeID },
      { $set: { is_active: "0" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-order");
  } catch (error) {
    console.log(error.message);
  }
};
// delivery order
const delivery_order = async (req, res) => {
  console.log(req.query.id);

  try {
    const removeID = req.query.id;
    console.log(removeID);
    await Order.findByIdAndUpdate({ _id: removeID }, { $set: { status: "2" } });
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-order");
  } catch (error) {
    console.log(error.message);
  }
};

// All User show
const all_user = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    const userData = await User.find({ type: 1, is_active: 1 });

    res.render("pages/AllUser", {
      admin: adminData,
      data: userData,
    });
    // res.render("pages/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// Seller Approve

const seller_approve = async (req, res) => {
  try {
    const userID = req.query.id;
    console.log(userID);
    await User.findByIdAndUpdate({ _id: userID }, { $set: { status: "2" } });
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-seller");
  } catch (error) {
    console.log(error.msg);
  }
};

// Reject seller request

const reject_approve = async (req, res) => {
  try {
    const userID = req.query.id;
    console.log(userID);
    await User.findByIdAndUpdate({ _id: userID }, { $set: { status: "0" } });
    res.setHeader("Content-Type", "text/html");
    res.redirect("/all-seller");
  } catch (error) {
    console.log(error.msg);
  }
};

// delete Sub Category
const delete_sub_catgory = async (req, res) => {
  try {
    const removeID = req.query.id;
    // console.log(removeID);
    await subCategory.findByIdAndUpdate(
      { _id: removeID },
      { $set: { status: "0" } }
    );
    res.setHeader("Content-Type", "text/html");
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// order-details

const order_details = async (req, res) => {
  try {
    const orderId = req.query.id;
    const data = await Order.findById({
      _id: orderId,
    });
    // console.log(orderDetailsData);
    const adminData = await Admin.findById({ _id: req.session.user_id });
    res.render("pages/orderDetails", {
      admin: adminData,
      data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// delete Sub Category

// user login start
const edit_profile = async (req, res) => {
  try {
    const adminData = await Admin.findById({ _id: req.session.user_id });
    res.render("pages/edit-profile", {
      admin: adminData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const admin_password = async (req, res) => {
  console.log(req.body.ppassword);
  console.log(req.body.id);
  try {
    const id = req.body.id;
    let data = await User.find({ _id: id });
    if (data) {
      const password = req.body.password;
      const userData = await Admin.updateOne({ $set: { password: password } });
      if (userData) {
        const adminData = await Admin.findById({ _id: req.session.user_id });
        const productData = await Product.find({ is_active: 1 });
        // console.log(adminData);
        res.redirect("/dashboard");
      }
    } else {
      res.status(400).send({ success: false, msg });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  verifiyLogin,
  dashboard,

  all_category,
  addCategory,
  deleteCategroy,
  editCategroy,
  postEditCategory,
  sub_categroy,
  create_sub_categroy,

  deleteSubCategroy,
  editSubCategroy,
  add_product,
  post_product,
  delete_product,
  all_product,
  deleteProduct,
  editProduct,
  postEditProduct,
  verifiySingupLoad,
  all_seller,
  delete_seller,
  all_product_add_by_seller,
  approve_product,
  reject_product,
  all_Order,
  approve_order,
  delete_order,
  delivery_order,
  all_user,
  seller_approve,
  reject_approve,

  postEditSubCategory,
  delete_sub_catgory,
  order_details,
  edit_profile,
  admin_password,
};
