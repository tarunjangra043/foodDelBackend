const { orderModel } = require("../models/orderModel");
const { userModel } = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-psi-six.vercel.app";
  // const frontend_url = "https://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (err) {
    console.error("Error creating Stripe session:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error processing payment" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (e) {
    res.json({ success: false, message: "Error" });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "No Orders found!" });
    }
    res.json({ success: true, data: orders });
  } catch (e) {
    console.error("Error fetching user orders:", e);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

//Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({
      success: true,
      message: "Status Updated!",
    });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

exports.placeOrder = placeOrder;
exports.verifyOrder = verifyOrder;
exports.userOrders = userOrders;
exports.listOrders = listOrders;
exports.updateStatus = updateStatus;
