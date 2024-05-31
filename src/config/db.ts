import mongoose, { ConnectOptions } from "mongoose";

// mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://time:time09062545@cluster0.uzfcokj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        //mongodb://localhost:27017/wordle_db
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
    console.log("Database is connected");
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDB;