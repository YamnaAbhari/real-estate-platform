import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
      match: [/^09\d{9}$/, "Please fill a valid phone number"],
      trim: true,
    },
    password: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse:true,
      unique:true
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    profilePic: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    sellerStatus: {
      type: String,
      enum: ["pending", "approved", "reject"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
