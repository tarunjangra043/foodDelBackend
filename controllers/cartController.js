const { userModel } = require("../models/userModel");

// add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Added to Cart 🛒" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Failed to add item to cart 🛒" });
  }
};

// remove items from user cart
const removeCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.user.id, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Error" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: "Error" });
  }
};

exports.addToCart = addToCart;
exports.removeCart = removeCart;
exports.getCart = getCart;
