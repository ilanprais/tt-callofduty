import mongoose from "mongoose";

const startMongoConnection = async () => {
    const mongoURI = process.env.URI_MONGO ? process.env.URI_MONGO : "";
    await mongoose.connect(mongoURI);
  }

export { startMongoConnection };
