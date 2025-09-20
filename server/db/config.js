// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB Connected...");
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

let cached = global._mongoCached; // reuse across lambda invocations in Vercel
if (!cached) {
  cached = global._mongoCached = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      // use New URL parser and unified topology
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then(m => {
      return m;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;