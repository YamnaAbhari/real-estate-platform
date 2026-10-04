import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Property from "../Property/propertyMd.js";
import Chat from "./chatMd.js";
import Message from "../Message/messageMd.js";



export const getAllChats = catchAsync(async (req, res, next) => {
  let filter;

  if (req.user.role === "buyer") {
    filter = {
      buyerId: req.user._id,
      deletedByBuyer: false,
    };
  } else if (req.user.role === "seller") {
    filter = {
      sellerId: req.user._id,
      deletedBySeller: false,
    };
  } else {
    return next(new HandleERROR("شما اجازه مشاهده گفت‌وگوها را ندارید", 403));
  }

  const chats = await Chat.find(filter)
    .sort({ createdAt: -1 })
    .populate([
      { path: "buyerId", select: "name phoneNumber profilePic" },
      { path: "sellerId", select: "name phoneNumber profilePic" },
    ]);

  const chatsWithUnreadCount = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chatId: chat._id,
        senderId: { $ne: req.user._id },
        isRead: false,
      });
      return {
        ...chat.toObject(),
        unreadCount,
      };
    }),
  );

  return res.status(200).json({
    success: true,
    count: chatsWithUnreadCount.length,
    data: chatsWithUnreadCount,
  });
});


// export const getAllChats = catchAsync(async (req, res, next) => {
//   let manualFilter;

//   if (req.user.role === "buyer") {
//     manualFilter = {
//       buyerId: req.user._id,
//       deletedByBuyer: false,
//     };
//   } else if (req.user.role === "seller") {
//     manualFilter = {
//       sellerId: req.user._id,
//       deletedBySeller: false,
//     };
//   } else {
//     return next(new HandleERROR("شما اجازه مشاهده گفت‌وگوها را ندارید", 403));
//   }

//   const features = new ApiFeatures(Chat, req.query, req.role)
//     .addManualFilters(manualFilter)
//     .limitFields()
//     .sort()
//     .populate([
//       {
//         path: "buyerId",
//         select: "name phoneNumber profilePic",
//       },
//       {
//         path: "sellerId",
//         select: "name phoneNumber profilePic",
//       },
//     ])
//     .paginate();

//   const result = await features.execute();

//   const chatsWithUnreadCount = await Promise.all(
//     result.data.map(async (chat) => {
//       const unreadCount = await Message.countDocuments({
//         chatId: chat._id,
//         senderId: { $ne: req.user._id },
//         isRead: false,
//       });
//       return {
//         ...chat,
//         unreadCount,
//       };
//     }),
//   );

//   return res.status(200).json({
//     success: true,
//     count: result.count,
//     data: chatsWithUnreadCount,
//   });
// });

// export const getOneChat = catchAsync(async (req, res, next) => {
//   const features = new ApiFeatures(Chat, req.query, req.role)
//     .addManualFilters({
//       _id: req.params.id,
//       $or: [{ buyerId: req.user._id }, { sellerId: req.user._id }],
//     })
//     .populate([
//       {
//         path: "buyerId",
//         select: "name phoneNumber profilePic",
//       },
//       {
//         path: "sellerId",
//         select: "name phoneNumber profilePic",
//       },
//     ]);

//   const result = await features.execute();

//   if (!result) {
//     return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
//   }

//   return res.status(200).json({
//     success: true,
//     data: result,
//   });
// });


export const getOneChat = catchAsync(async (req, res, next) => {
  const chat = await Chat.findOne({
    _id: req.params.id,
    $or: [
      { buyerId: req.user._id },
      { sellerId: req.user._id },
    ],
  }).populate([
    {
      path: "buyerId",
      select: "name phoneNumber profilePic",
    },
    {
      path: "sellerId",
      select: "name phoneNumber profilePic",
    },
  ]);

  if (!chat) {
    return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: chat,
  });
});





// export const createChat = catchAsync(async (req, res, next) => {
//   const { propertyId } = req.body;
//   const property = await Property.findById(propertyId);
//   if (!property) {
//     return next(new HandleERROR("ملکی یافت نشد", 404));
//   }
//   const sellerId = property.sellerId;
//   const buyerId = req.user._id;

//   const existingChat = await Chat.findOne({
//     sellerId,
//     buyerId,
//     // propertyId,
//   });
//   if (existingChat) {
//     return res.status(200).json({
//       success: true,
//       message: "این گفت‌وگو قبلاً ایجاد شده است",
//       data: existingChat,
//     });
//   }
//   let chat = await Chat.create({
//     sellerId,
//     buyerId,
//     // propertyId,
//   });

//   await chat.populate([
//     { path: "sellerId", select: "name phoneNumber profilePic" },
//     { path: "buyerId", select: "name phoneNumber profilePic" },
//     // { path: "propertyId", select: "title price images city" },
//   ]);

//   return res.status(201).json({
//     success: true,
//     message: "گفت‌وگو با موفقیت ایجاد شد",
//     data: chat,
//   });
// });

export const createChat = catchAsync(async (req, res, next) => {
  const { propertyId } = req.body;

  const property = await Property.findById(propertyId);

  if (!property) {
    return next(new HandleERROR("ملکی یافت نشد", 404));
  }

  const sellerId = property.sellerId;
  const buyerId = req.user._id;

  let chat = await Chat.findOne({
    sellerId,
    buyerId,
  });

  if (!chat) {
    chat = await Chat.create({
      sellerId,
      buyerId,
    });
  }

  const message = await Message.create({
    chatId: chat._id,
    senderId: buyerId,
    propertyId: property._id,
    text: `درخواست گفتگو درباره ملک «${property.title}»`,
    isRead: false,
  });

  await chat.populate([
    { path: "sellerId", select: "name phoneNumber profilePic" },
    { path: "buyerId", select: "name phoneNumber profilePic" },
  ]);

  await message.populate({
    path: "propertyId",
    select: "title price images city",
  });

  return res.status(201).json({
    success: true,
    message: "گفت‌وگو با موفقیت ایجاد شد",
    data: {
      chat,
      firstMessage: message,
    },
  });
});

export const removeChat = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);

  if (!chat) {
    return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
  }
  const userId = req.user._id.toString();

  const isBuyer = chat.buyerId.toString() === userId;
  const isSeller = chat.sellerId.toString() === userId;

  if (!isBuyer && !isSeller) {
    return next(new HandleERROR("شما اجازه حذف این گفت‌وگو را ندارید", 403));
  }

  if (isBuyer) {
    chat.deletedByBuyer = true;
  }

  if (isSeller) {
    chat.deletedBySeller = true;
  }

  await chat.save();

  return res.status(200).json({
    success: true,
    message: "گفت‌وگو با موفقیت حذف شد",
  });
});
