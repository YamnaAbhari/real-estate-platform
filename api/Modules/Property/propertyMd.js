import mongoose from "mongoose";
import { randomUUID } from "crypto";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },

    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    propertyType: {
      type:String,
      enum: [
    "apartment",   
    "villa",     
    "office",   
    "shop",     
    "land",     
    "warehouse"  
      ],
      required: true,
    },
    area: {
      type: Number,
      required: true,
      min: 1,
    },
    floor: {
      type: Number,
      default:null
    },
    yearBuilt: {
      type: Number,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: {
      type: [String],
      enum: [
        "elevator",
        "balcony",
        "storage",
        "pool",
        "garden",
        "gym",
        "security",
        "airConditioner",
        "parking",
      ],
      default: [],
    },
    furnishing: {
      type: String,
      enum: ["furnished", "unfurnished"],
      default: "unfurnished",
    },
    views: {
      type: Number,
      default: 0,
    },
    viewedBy:{
      type:[String],
      default:[]
    },
    propertyCode: {
      type: String,
      unique: true,
      default: () => randomUUID().slice(0, 8).toUpperCase(),
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    slug:{
        type:String,
        unique:true,
        trim:true
    }
  },{timestamps:true}
);

propertySchema.pre("save", function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FF\w-]/g, "")
      .replace(/-+/g, "-");
  }
});

const Property=mongoose.model("Property",propertySchema)
export default Property