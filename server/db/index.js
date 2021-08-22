// Main DB file
import mongoose from "mongoose";
import keys from "../keys";
import session from "express-session";
// import * as mongoDbStore from "connect-mongodb-session";
// const MongoDBStore = mongoDbStore(session);
import { default as connectMongoDBSession } from "connect-mongodb-session";
const MongoDBStore = connectMongoDBSession(session);

// Include all models
import("../models/user");
import("../models/product");
import("../models/category");
import("../models/product-hero");
import("../models/experience");

mongoose.set("useFindAndModify", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

exports.initSessionStore = function() {
  const store = new MongoDBStore({
    uri: keys.DB_URI,
    collection: "selfpromoSessions"
  });

  store.on("error", error => console.log(error));

  return store;
};

exports.connect = async function() {
  try {
    await mongoose.connect(keys.DB_URI);
    console.log("DB Connected!");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
