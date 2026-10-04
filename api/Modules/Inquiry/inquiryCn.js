import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Property from "../Property/propertyMd.js";
import Inquiry from "./inquiryMd.js";

export const sendInquiry = catchAsync(async (req, res, next) => {
  const { propertyId, message } = req.body;

  const property = await Property.findById(propertyId).populate("sellerId");
  if (!property) return next(new HandleERROR("ملک یافت نشد", 404));

  const inquiry = await Inquiry.create({
    sellerId: property.sellerId._id,
    buyerId: req.user._id,
    message,
    propertyId,
  });

  return res.status(201).json({
    success: true,
    message: "جست‌وجو با موفقیت ثبت شد",
    data: inquiry,
  });
});

// get all inquiries
export const getAllInquiries = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Inquiry, req.query, req.role)
    .filter()
    .limitFields()
    .sort()
    .populate([
      { path: "buyerId", select: "name phoneNumber profilePic" },
      {
        path: "propertyId",
        select: "title images price city province district",
      },
      { path: "sellerId", select: "name phoneNumber profilePic" },
    ])
    .paginate();

    const result=await features.execute()
    
    return res.status(200).json(result)
});

// seller views inquires
export const getSellerInquires = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.find({ sellerId: req.user._id })
    .populate([
      { path: "buyerId", select: "name phoneNumber" },
      {
        path: "propertyId",
        select: "title images price city province district",
      },
    ])
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: inquiry.length,
    data: inquiry,
  });
});

// mark inquires read
export const markAsRead = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    return next(new HandleERROR("جست و جو یافت نشد", 404));
  }

  if (inquiry.isRead) {
    return res.status(200).json({
      success: true,
      message: "این جست‌وجو قبلاً خوانده شده است",
    });
  }

  inquiry.isRead = true;
  await inquiry.save();

  return res.status(200).json({
    success: true,
    message: "جست‌وجو با موفقیت خوانده شد",
  });
});
