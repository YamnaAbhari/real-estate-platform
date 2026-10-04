// import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
// import Property from "./propertyMd.js";
// import path from "path";
// import fs from "fs";
// import jwt from "jsonwebtoken";
// import Inquiry from "../Inquiry/inquiryMd.js";
// import Wishlist from "../Wishlist/wishlistMd.js";

// /** Returns a filtered, searchable, paginated list of properties. */
// export const getAll = catchAsync(async (req, res, next) => {
//   const features = new ApiFeatures(Property, req.query, req.role)
//     .filter()
//     .search(["city", "province", "district"])
//     .sort()
//     .limitFields()
//     .populate([
//       {
//         path: "sellerId",
//         select: "name isVerified profilePic sellerStatus phoneNumber",
//       },
//     ])
//     .paginate();
//   const result = await features.execute();
//   return res.status(200).json(result);
// });

// /** Returns one property and its seller details. */
// export const getOne = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id).populate(
//     "sellerId",
//     "name phoneNumber profilePic",
//   );
//   if (!property) {
//     return next(new HandleERROR("ملکی یافت نشد", 404));
//   }
//   return res.status(200).json({
//     success: true,
//     data: property,
//   });
// });

// /** Returns all properties owned by the authenticated seller. */
// export const getMyProperty = catchAsync(async (req, res, next) => {
//   4;
//   const { sort = "-createdAt", limit } = req.query;
//   const properties = await Property.find({
//     sellerId: req.user._id,
//   })
//     .populate("sellerId", "name phoneNumber profilePic")
//     .limit(Number(limit))
//     .sort(sort);
//   if (properties.length === 0) {
//     return next(new HandleERROR("ملکی یافت نشد", 404));
//   }
//   return res.status(200).json({
//     success: true,
//     data: properties,
//   });
// });

// /** Creates a pending property listing for an approved seller. */
// export const create = catchAsync(async (req, res, next) => {
//   const {
//     title,
//     description,
//     price,
//     province,
//     city,
//     district,
//     propertyType,
//     listingType,
//     yearBuilt,
//     bedrooms,
//     area,
//     images,
//     amenities
//   } = req.body;
//   if (req.user.sellerStatus !== "approved") {
//     return next(
//       new HandleERROR("حساب فروشندگی شما هنوز توسط مدیر تأیید نشده است", 403),
//     );
//   }
//   const property = await Property.create({
//     title,
//     description,
//     price,
//     province,
//     city,
//     district,
//     propertyType,
//     listingType,
//     area,
//     yearBuilt,
//     bedrooms,
//     images: images || [],
//     sellerId: req.user._id,
//     approvalStatus: "pending",
//     status: "available",
//     views: 0,
//     viewedBy: [],
//     amenities
//   });
//   return res.status(201).json({
//     success: true,
//     message: "ملک با موفقیت ثبت شد و پس از تأیید مدیر منتشر خواهد شد",
//     data: property,
//   });
// });

// /** Updates a property listing owned by the authenticated seller. */
// export const update = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);
//   if (!property) {
//     return next(new HandleERROR("ملک یافت نشد", 404));
//   }

//   if (req.user._id.toString() !== property.sellerId.toString()) {
//     return next(new HandleERROR("شما اجازه ویرایش این ملک را ندارید", 403));
//   }
//   const allowFields = [
//     "title",
//     "description",
//     "price",
//     "province",
//     "city",
//     "district",
//     "listingType",
//     "propertyType",
//     "area",
//     "floor",
//     "yearBuilt",
//     "bedrooms",
//     "furnishing",
//     "amenities",
//     "status",
//     "images",
//   ];

//   allowFields.forEach((field) => {
//     if (req.body[field] !== undefined) {
//       property[field] = req.body[field];
//     }
//   });

//   if (req.body?.images) {
//     for (let image of property.images ?? []) {
//       const exists = req.body.images.includes(image);
//       if (!exists) {
//         const oldPath = path.join(__dirname, "Public", image);
//         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//       }
//     }
//   }

//   await property.save();

//   return res.status(200).json({
//     success: true,
//     message: "ملک با موفقیت بروزرسانی شد",
//     data: property,
//   });
// });

// /** Deletes a property listing and its associated image files. */
// export const remove = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);

//   if (!property) return next(new HandleERROR("ملک یافت نشد", 404));

//   const isSeller = req.user._id.toString() === property.sellerId.toString();
//   const isAdmin = req.user.role === "admin";

//   if (!isSeller && !isAdmin) {
//     return next(new HandleERROR("شما اجازه حذف این ملک را ندارید", 403));
//   }

//   await Wishlist.deleteMany({ propertyId: req.params.id });

//   await Property.findByIdAndDelete(req.params.id);

//   if (property.images) {
//     for (let image of property.images) {
//       const oldPath = path.join(__dirname, "Public", image);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//     }
//   }

//   return res.status(200).json({
//     success: true,
//     message: "ملک با موفقیت حذف شد",
//   });
// });

// /** Changes the availability status of a seller-owned property. */
// export const changeStatus = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);
//   if (!property) {
//     return next(new HandleERROR("ملک یافت نشد", 404));
//   }

//   if (property.sellerId.toString() !== req.user._id.toString()) {
//     return next(new HandleERROR("شما اجازه تغییر این ملک را ندارید", 403));
//   }

//   const allowedStatus = ["available", "sold", "rented"];
//   if (!allowedStatus.includes(req.body.status)) {
//     return next(new HandleERROR("وضعیت ملک نامعتبر است", 400));
//   }

//   property.status = req.body.status;
//   await property.save();

//   return res.status(200).json({
//     success: true,
//     message: "وضعیت ملک تغییر کرد",
//     data: property,
//   });
// });

// /** Changes a property's approval status. */
// export const changeApprovalStatus = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);
//   if (!property) {
//     return next(new HandleERROR("ملک یافت نشد", 404));
//   }

//   const allowedStatus = ["pending", "approved", "rejected"];
//   if (!allowedStatus.includes(req.body.approvalStatus)) {
//     return next(new HandleERROR("وضعیت تایید نامعتبر است", 400));
//   }

//   property.approvalStatus = req.body.approvalStatus;
//   await property.save();

//   return res.status(200).json({
//     success: true,
//     message: "وضعیت تایید ملک تغییر کرد",
//     data: property,
//   });
// });

// /** Returns the view count and records a unique visitor view. */
// // export const views = catchAsync(async (req, res, next) => {
// //   const property = await Property.findById(req.params.id);
// //   if (!property) {
// //     return next(new HandleERROR("ملک یافت نشد", 404));
// //   }

// //   let visitorId = req.ip;

// //   const authHeader = req.headers.authorization;
// //   if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
// //     try {
// //       const token = authHeader.split(" ")[1];
// //       const decoded = jwt.verify(token, process.env.SECRET_KEY);
// //       visitorId = decoded._id;
// //     } catch (error) {
// //       console.error("Invalid token:", error.message);
// //       return res.status(401).json({ error: "توکن نامعتبر است" });
// //     }
// //   }
// //   const isSeller = visitorId === property.sellerId.toString();
// //   if (!isSeller && !property.viewedBy.includes(visitorId)) {
// //     property.views++;
// //     property.viewedBy.push(visitorId);
// //     await property.save();
// //   }

// //   return res.status(200).json({
// //     success: true,
// //     data: {
// //       views: property.views,
// //     },
// //   });
// // });

// export const views = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);

//   console.log("PROPERTY:", property?._id);

//   if (!property) {
//     return next(new HandleERROR("ملک یافت نشد", 404));
//   }

//   let visitorId = req.ip;

//   const authHeader = req.headers.authorization;

//   console.log("AUTH HEADER:", authHeader);

//   if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
//     try {
//       const token = authHeader.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.SECRET_KEY);

//       console.log("DECODED:", decoded);

//       visitorId = decoded._id;
//     } catch (error) {
//       console.error("Invalid token:", error.message);

//       return res.status(401).json({
//         error: "توکن نامعتبر است",
//       });
//     }
//   }

//   console.log("VISITOR ID:", visitorId);
//   console.log("VIEWS BEFORE:", property.views);
//   console.log("VIEWED BY:", property.viewedBy);

//   const isSeller = visitorId === property.sellerId.toString();

//   console.log("IS SELLER:", isSeller);

//   if (!isSeller && !property.viewedBy.includes(visitorId)) {
//     property.views++;
//     property.viewedBy.push(visitorId);

//     await property.save();

//     console.log("VIEW ADDED:", property.views);
//   }

//   return res.status(200).json({
//     success: true,
//     views: property.views,
//   });
// });

// /** Returns up to six approved, available properties similar to one listing. */
// export const similarProperties = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);
//   if (!property) {
//     return next(new HandleERROR("ملک یافت نشد", 404));
//   }

//   const similarProperty = await Property.find({
//     _id: { $ne: property._id },
//     listingType: property.listingType,
//     propertyType: property.propertyType,
//     status: "available",
//     approvalStatus: "approved",
//   }).limit(4);

//   return res.status(200).json({
//     success: true,
//     data: similarProperty,
//   });
// });

import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Property from "./propertyMd.js";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import Inquiry from "../Inquiry/inquiryMd.js";
import Wishlist from "../Wishlist/wishlistMd.js";
import { __dirname } from "../../app.js";

/** Returns a filtered, searchable, paginated list of properties. */
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Property, req.query, req.role)
    .filter()
    .search(["city", "province", "district"])
    .sort()
    .limitFields()
    .populate([
      {
        path: "sellerId",
        select: "name isVerified profilePic sellerStatus phoneNumber",
      },
    ])
    .paginate();
  const result = await features.execute();
  return res.status(200).json(result);
});

/** Returns one property and its seller details. */
export const getOne = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate(
    "sellerId",
    "name phoneNumber profilePic",
  );
  if (!property) {
    return next(new HandleERROR("ملکی یافت نشد", 404));
  }
  return res.status(200).json({
    success: true,
    data: property,
  });
});

/** Returns all properties owned by the authenticated seller. */
export const getMyProperty = catchAsync(async (req, res, next) => {
  const {
    sort = "-createdAt",
    limit,
    title,
    propertyType,
    listingType,
    location,
  } = req.query;

  const filter = {
    sellerId: req.user._id,
  };

  if (title?.trim()) {
    filter.title = {
      $regex: title.trim(),
      $options: "i",
    };
  }

  if (propertyType?.trim()) {
    filter.propertyType = {
      $regex: propertyType.trim(),
      $options: "i",
    };
  }

  if (listingType?.trim()) {
    filter.listingType = {
      $regex: listingType.trim(),
      $options: "i",
    };
  }

  if (location?.trim()) {
    const searchWords = location.trim().split(/[\s,،_\/-]+/);

    filter.$and = searchWords.map((word) => ({
      $or: [
        {
          province: {
            $regex: word,
            $options: "i",
          },
        },
        {
          city: {
            $regex: word,
            $options: "i",
          },
        },
        {
          district: {
            $regex: word,
            $options: "i",
          },
        },
      ],
    }));
  }

  const query = Property.find(filter)
    .populate("sellerId", "name phoneNumber profilePic")
    .sort(sort);
    if(limit){
      query.limit(Number(limit))
    }

    const properties = await query;

  return res.status(200).json({
    success: true,
    data: properties,
  });
});


/** Creates a pending property listing for an approved seller. */
export const create = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    price,
    province,
    city,
    district,
    propertyType,
    listingType,
    yearBuilt,
    bedrooms,
    area,
    images,
    amenities,
    floor,
  } = req.body;
  if (req.user.sellerStatus !== "approved") {
    return next(
      new HandleERROR("حساب فروشندگی شما هنوز توسط مدیر تأیید نشده است", 403),
    );
  }
  const property = await Property.create({
    title,
    description,
    price,
    province,
    city,
    district,
    propertyType,
    listingType,
    area,
    yearBuilt,
    bedrooms,
    images: images || [],
    sellerId: req.user._id,
    approvalStatus: "pending",
    status: "available",
    views: 0,
    viewedBy: [],
    amenities,
    floor,
  });
  return res.status(201).json({
    success: true,
    message: "ملک با موفقیت ثبت شد و پس از تأیید مدیر منتشر خواهد شد",
    data: property,
  });
});

/** Updates a property listing owned by the authenticated seller. */
export const update = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new HandleERROR("ملک یافت نشد", 404));
  }

  if (req.user._id.toString() !== property.sellerId.toString()) {
    return next(new HandleERROR("شما اجازه ویرایش این ملک را ندارید", 403));
  }
  const allowFields = [
    "title",
    "description",
    "price",
    "province",
    "city",
    "district",
    "listingType",
    "propertyType",
    "area",
    "floor",
    "yearBuilt",
    "bedrooms",
    "furnishing",
    "amenities",
    "status",
    "images",
  ];

  allowFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      property[field] = req.body[field];
    }
  });

  if (req.body?.images) {
    for (let image of property.images ?? []) {
      const exists = req.body.images.includes(image);
      if (!exists) {
        const oldPath = path.join(__dirname, "Public", image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
  }

  await property.save();

  return res.status(200).json({
    success: true,
    message: "ملک با موفقیت بروزرسانی شد",
    data: property,
  });
});

/** Deletes a property listing and its associated image files. */
export const remove = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) return next(new HandleERROR("ملک یافت نشد", 404));

  const isSeller = req.user._id.toString() === property.sellerId.toString();
  const isAdmin = req.user.role === "admin";

  if (!isSeller && !isAdmin) {
    return next(new HandleERROR("شما اجازه حذف این ملک را ندارید", 403));
  }

  await Wishlist.deleteMany({ propertyId: req.params.id });

  await Property.findByIdAndDelete(req.params.id);

  if (property.images) {
    for (let image of property.images) {
      const oldPath = path.join(__dirname, "Public", image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  }

  return res.status(200).json({
    success: true,
    message: "ملک با موفقیت حذف شد",
  });
});

/** Changes the availability status of a seller-owned property. */
export const changeStatus = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new HandleERROR("ملک یافت نشد", 404));
  }

  if (property.sellerId.toString() !== req.user._id.toString()) {
    return next(new HandleERROR("شما اجازه تغییر این ملک را ندارید", 403));
  }

  const allowedStatus = ["available", "sold", "rented"];
  if (!allowedStatus.includes(req.body.status)) {
    return next(new HandleERROR("وضعیت ملک نامعتبر است", 400));
  }

  property.status = req.body.status;
  await property.save();

  return res.status(200).json({
    success: true,
    message: "وضعیت ملک تغییر کرد",
    data: property,
  });
});

/** Changes a property's approval status. */
export const changeApprovalStatus = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new HandleERROR("ملک یافت نشد", 404));
  }

  const allowedStatus = ["pending", "approved", "rejected"];
  if (!allowedStatus.includes(req.body.approvalStatus)) {
    return next(new HandleERROR("وضعیت تایید نامعتبر است", 400));
  }

  property.approvalStatus = req.body.approvalStatus;
  await property.save();

  return res.status(200).json({
    success: true,
    message: "وضعیت تایید ملک تغییر کرد",
    data: property,
  });
});

/** Returns the view count and records a unique visitor view. */
// export const views = catchAsync(async (req, res, next) => {
//   const property = await Property.findById(req.params.id);
//   if (!property) {
//     return next(new HandleERROR("ملک یافت نشد", 404));
//   }

//   let visitorId = req.ip;

//   const authHeader = req.headers.authorization;
//   if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
//     try {
//       const token = authHeader.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.SECRET_KEY);
//       visitorId = decoded._id;
//     } catch (error) {
//       console.error("Invalid token:", error.message);
//       return res.status(401).json({ error: "توکن نامعتبر است" });
//     }
//   }
//   const isSeller = visitorId === property.sellerId.toString();
//   if (!isSeller && !property.viewedBy.includes(visitorId)) {
//     property.views++;
//     property.viewedBy.push(visitorId);
//     await property.save();
//   }

//   return res.status(200).json({
//     success: true,
//     data: {
//       views: property.views,
//     },
//   });
// });

export const views = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  console.log("PROPERTY:", property?._id);

  if (!property) {
    return next(new HandleERROR("ملک یافت نشد", 404));
  }

  let visitorId = req.ip;

  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader);

  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    try {
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      console.log("DECODED:", decoded);

      visitorId = decoded._id;
    } catch (error) {
      console.error("Invalid token:", error.message);

      return res.status(401).json({
        error: "توکن نامعتبر است",
      });
    }
  }

  console.log("VISITOR ID:", visitorId);
  console.log("VIEWS BEFORE:", property.views);
  console.log("VIEWED BY:", property.viewedBy);

  const isSeller = visitorId === property.sellerId.toString();

  console.log("IS SELLER:", isSeller);

  if (!isSeller && !property.viewedBy.includes(visitorId)) {
    property.views++;
    property.viewedBy.push(visitorId);

    await property.save();

    console.log("VIEW ADDED:", property.views);
  }

  return res.status(200).json({
    success: true,
    views: property.views,
  });
});

/** Returns up to six approved, available properties similar to one listing. */
export const similarProperties = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new HandleERROR("ملک یافت نشد", 404));
  }

  const similarProperty = await Property.find({
    _id: { $ne: property._id },
    listingType: property.listingType,
    propertyType: property.propertyType,
    status: "available",
    approvalStatus: "approved",
  }).limit(4);

  return res.status(200).json({
    success: true,
    data: similarProperty,
  });
});
