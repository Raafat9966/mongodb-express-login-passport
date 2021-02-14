const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const router = require("./routes/router");

let port = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use(router);

app.listen(port, () => console.log(`http://localhost:${port}`));
