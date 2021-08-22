import express from "express";
const app = express();
import session from "express-session";
import db from "../db";

import cors from "cors";
import bodyParser from "body-parser";
import keys from "../keys";
import passport from "passport";

import usersRoutes from "./user";
import productRoutes from "./product";
import categoryRoutes from "./category";
import experienceRoutes from "./experience";
import apiRoutes from "./api";
import productHeroRoutes from "./product-hero";

import("../services/passport");

// connect to DB
db.connect();
const store = db.initSessionStore();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// var csrf = require('csurf');
// consider using this

// session setup
const sess = {
  name: "promo-secure-session",
  secret: keys.SESSION_SECRET,
  cookie: { maxAge: 2 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: false,
  store
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
  sess.cookie.httpOnly = true;
  sess.cookie.sameSite = true;
  sess.cookie.domain = process.env.DOMAIN; // .yourdomain.com
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

/* app.use((req, res, next) => {
  console.log(req.session)
  console.log(req.user)
  next()
}) */

// Routers registeration
app.use("", apiRoutes);
app.use("/product-heroes", productHeroRoutes);
app.use("/users", usersRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/experiences", experienceRoutes);

module.exports = {
  path: "/api/v1",
  handler: app
};
