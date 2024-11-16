const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.js");
const foodRouter = require("./routes/foodRoute.js");
const { userRouter } = require("./routes/userRoute.js");
const { cartRouter } = require("./routes/cartRoute.js");

//app config
const app = express();
const port = 4000;

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config({ path: ".env" });

// DB CONNECTION
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
