const express = require("express");
const { authMiddleware } = require("../middleware/auth");

const {
  placeOrder,
  verifyOrder,
  userOrders,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

exports.orderRouter = orderRouter;
