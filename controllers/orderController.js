const { orderModel } = require("../models/orderModel");
const { userModel } = require("../models/userModel");
const stripe = require("stripe");

const Stripe = stripe(process.env.STRIPE_SECRET_KEY); // Correct initialization

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-psi-six.vercel.app";

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

    // Add delivery charges
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

    const session = await Stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url }); // Corrected response
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error", error: err.message }); // Added error detail
  }
};

exports.placeOrder = placeOrder;
