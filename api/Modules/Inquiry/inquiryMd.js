import mongoose from "mongoose";

const inquiryScheme = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message:{
    type:String,
    required:true,
    trim:true
  },
isRead:{
    type:Boolean,
    default:false
}
},{timestamps:true});

const Inquiry=mongoose.model('Inquiry',inquiryScheme)
export default Inquiry
