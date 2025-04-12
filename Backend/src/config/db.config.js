import mongoose from "mongoose";

class Database {
  constructor(uri) {
    this.uri = uri;
  }

  async connect() {
    await mongoose
      .connect(this.uri)
      .then(() => {
        console.log("MongoDB is connected successfully!");
      })
      .catch((err) => {
        console.error("MongoDB connection error", err);
      });
  }
}

export { Database };
