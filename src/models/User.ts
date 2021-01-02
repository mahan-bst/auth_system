import mongoose from "mongoose";
import mongoose_uniquie from "mongoose-unique-validator";
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
schema.plugin(mongoose_uniquie);
export default mongoose.model("users", schema);
