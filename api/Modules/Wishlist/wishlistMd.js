import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{timestamps:true});

wishlistSchema.index(
  {userId:1,propertyId:1},
  {unique:true}
)

const Wishlist=mongoose.model('Wishlist',wishlistSchema)
export default Wishlist
