const mongoose = require('mongoose');
require('dotenv').config();

  const  mongoUri= process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Successfully connected to Database!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = connectDB;
