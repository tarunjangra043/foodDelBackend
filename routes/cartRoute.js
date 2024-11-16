const express = require("express");
const {
  addToCart,
  removeCart,
  getCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/auth");

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeCart);
cartRouter.post("/get", authMiddleware, getCart);

exports.cartRouter = cartRouter;
