import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Chat from "../Chat/chatMd.js";
import Message from "./messageMd.js";

export const sendMessage = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const { text } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
  }

  const isMember =
    chat.buyerId.toString() === req.user._id.toString() ||
    chat.sellerId.toString() === req.user._id.toString();

  if (!isMember) {
    return next(
      new HandleERROR("شما اجازه ارسال پیام در این گفت‌وگو را ندارید", 403),
    );
  }

  if (!text || !text.trim()) {
    return next(new HandleERROR("متن پیام الزامی است", 400));
  }

  const message = await Message.create({
    chatId,
    senderId: req.user._id,
    text: text.trim(),
    isRead: false,
  });

  await message.populate([
    { path: "senderId", select: "name phoneNumber profilePic" },
    { path: "propertyId", select: "title price images city" },
  ]);

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: text.trim(),
    lastMessageAt: new Date(),
  });

  const io = req.app.get("io");
  io.to(chatId).emit("receiveMessage", message);

  return res.status(201).json({
    success: true,
    message: "پیام با موفقیت ارسال شد",
    data: message,
  });
});

export const getMessage = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
  }

  const isMember =
    chat.buyerId.toString() === req.user._id.toString() ||
    chat.sellerId.toString() === req.user._id.toString();

  if (!isMember) {
    return next(
      new HandleERROR("شما اجازه مشاهده پیام‌های این گفت‌وگو را ندارید", 403),
    );
  }

  const messages = await Message.find({ chatId })
    .populate("senderId", "name phoneNumber profilePic")
    .populate("propertyId", "title price images city")
    .sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    data: messages,
  });
});

export const markMessagesAsRead = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
  }

  const isMember =
    chat.buyerId.toString() === req.user._id.toString() ||
    chat.sellerId.toString() === req.user._id.toString();

  if (!isMember) {
    return next(
      new HandleERROR("شما اجازه مشاهده پیام‌های این گفت‌وگو را ندارید", 403),
    );
  }

  await Message.updateMany(
    {
      chatId,
      senderId: { $ne: req.user._id },
      isRead: false,
    },
    {
      $set: { isRead: true },
    },
  );

  const io = req.app.get("io");
  io.to(chatId).emit("messagesRead", {
    chatId,
    userId: req.user._id,
  });

  return res.status(200).json({
    success: true,
    message: "پیام‌ها خوانده شدند",
  });
});

export const removeMessage = catchAsync(async (req, res, next) => {
  const { chatId, messageId } = req.params;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new HandleERROR("گفت‌وگو یافت نشد", 404));
  }

  const isMember =
    chat.buyerId.toString() === req.user._id.toString() ||
    chat.sellerId.toString() === req.user._id.toString();

  if (!isMember) {
    return next(
      new HandleERROR("شما اجازه مشاهده پیام‌های این گفت‌وگو را ندارید", 403),
    );
  }

  const message = await Message.findOne({ _id: messageId, chatId });
  if (!message) {
    return next(new HandleERROR("پیامی یافت نشد", 404));
  }

  if (message.senderId.toString() !== req.user._id.toString()) {
    return next(new HandleERROR("شما اجازه حذف این پیام رو ندارید", 403));
  }

  await message.deleteOne();

  const lastMessage = await Message.findOne({ chatId }).sort({ createdAt: -1 });
  if (lastMessage) {
    ((chat.lastMessage = lastMessage.text),
      (chat.lastMessageAt = lastMessage.createdAt));
  } else {
    ((chat.lastMessage = ""), (chat.lastMessageAt = null));
  }

  await chat.save();

  const io = req.app.get("io");
  io.to(chatId).emit("deletedMessage", {
    chatId,
    messageId,
    lastMessage: chat.lastMessage,
    lastMessageAt: chat.lastMessageAt,
  });

  return res.status(200).json({
    success: true,
    message: "پیام با موفقیت حذف شد",
  });
});
