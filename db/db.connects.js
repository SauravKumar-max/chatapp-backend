const mongoose = require("mongoose");

async function initializeDBConnection() {
  const mySecretURI = process.env["MONGODB_AUTH"];

  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mySecretURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connection Completed!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initializeDBConnection };
