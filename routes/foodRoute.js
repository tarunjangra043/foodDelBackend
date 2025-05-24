// foodRoute.js
const express = require("express");
const {
  addFood,
  listFood,
  removeFood,
} = require("../controllers/foodController");
const multer = require("multer");

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

module.exports = foodRouter;
