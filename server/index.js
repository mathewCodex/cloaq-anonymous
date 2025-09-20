// api/index.js
const serverless = require("serverless-http");
const app = require("./app");
const connectDB = require("./db/config");

let dbPromise;
if (!global._dbPromise) {
  global._dbPromise = connectDB();
}
dbPromise = global._dbPromise;

module.exports = async (req, res) => {
  try {
    await dbPromise;
  } catch (err) {
    console.error("DB connection error:", err);
    
  }
  return serverless(app)(req, res);
};
