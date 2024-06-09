import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
      try {
            const connectionInstance = await mongoose.connect(
                  `${process.env.MONGODB_URI}?dbName=${DB_Name}`
            );
            console.log("DB Host:", connectionInstance.connection.host);
            return connectionInstance;
      } catch (error) {
            console.log("DB connection failure: ", error);
            process.exit(1);
      }
};

export { connectDB };
