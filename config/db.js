import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGOOSE_URL);

export default mongoose;