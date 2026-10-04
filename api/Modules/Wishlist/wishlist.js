import { Router } from "express";
import {
  getMyWishlist,
  checkWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlistCn.js";
import {} from "./wishlistValidator.js";
import { validateGetMyWishlist } from "./wishlistValidator.js";
import { validatePropertyId } from "./wishlistValidator.js";

const wishlistRouter = Router();

wishlistRouter.route("/").get(validateGetMyWishlist, getMyWishlist);
wishlistRouter
  .route("/:propertyId")
  .get(validatePropertyId, checkWishlist)
  .post(validatePropertyId, addToWishlist)
  .delete(validatePropertyId, removeFromWishlist);

export default wishlistRouter;
