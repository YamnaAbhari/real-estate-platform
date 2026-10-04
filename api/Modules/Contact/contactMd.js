import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^09\d{9}$/, "Please fill a valid phone number"],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
    validate: [
      {
        validator: (v) => v.trim().split(/\s+/).length <= 250,
        message: "حداکثر ۲۵۰ کلمه مجاز است",
      },
    ],
  },
  status: {
  type: String,
  enum: ["pending", "read"],
  default: "pending",
}
},{timestamps:true});

const Contact=mongoose.model('Contact',contactSchema)
export default Contact
