import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Wishlist from "./wishlistMd.js";
import Property from "../Property/propertyMd.js";

export const getMyWishlist = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Wishlist, req.query, req.role)
    .addManualFilters({ userId: req.user._id })
    .filter()
    .limitFields()
    .sort()
    .populate({
      path: "propertyId",
      populate: { path: "sellerId", select: "name phoneNumber profilePic" },
    })
    .paginate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const checkWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({
    propertyId: req.params.propertyId,
    userId: req.user._id,
  });

  return res.status(200).json({
    success: true,
    data: {
      isWishlist: !!wishlist,
    },
  });
});

export const addToWishlist = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new HandleERROR("ملک یافت نشد", 404));
  }

  const exists = await Wishlist.findOne({
    propertyId,
    userId: req.user._id,
  });

  if (exists) {
    return next(
      new HandleERROR("این ملک قبلاً به علاقه‌مندی‌ها اضافه شده است", 400),
    );
  }

  const wishlist = await Wishlist.create({
    propertyId,
    userId: req.user._id,
  });
  return res.status(201).json({
    success: true,
    message: "ملک به علاقه‌مندی‌ها اضافه شد",
    data: wishlist,
  });
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const wishlist = await Wishlist.findOneAndDelete({
    userId: req.user._id,
    propertyId,
  });
  if (!wishlist) {
    return next(
      new HandleERROR("این ملک در علاقه‌مندی‌های شما وجود ندارد", 404),
    );
  }
  return res
    .status(200)
    .json({ success: true, message: "ملک از علاقه‌مندی‌ها حذف شد" });
});
