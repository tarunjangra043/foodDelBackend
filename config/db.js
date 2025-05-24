const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/../.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

exports.connectDB = async () => {
  await mongoose
    .connect(DB)
    .then(() => {
      console.log("DB CONNECTED!");
    })
    .catch((err) => console.log(err));
};
