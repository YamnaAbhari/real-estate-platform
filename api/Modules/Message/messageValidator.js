import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

export const validateSendMessage = [
  param("chatId")
    .notEmpty()
    .withMessage("شناسه گفت‌وگو الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه گفت‌وگو معتبر نیست"),

  body("text")
    .notEmpty()
    .withMessage("متن پیام الزامی است")
    .bail()
    .isString()
    .withMessage("متن پیام باید رشته باشد")
    .trim(),

  handleValidationErrors,
];

export const validateGetMessages = [
  param("chatId")
    .notEmpty()
    .withMessage("شناسه گفت‌وگو الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه گفت‌وگو معتبر نیست"),

  handleValidationErrors,
];

export const validateMarkMessagesAsRead = [
  param("chatId")
    .notEmpty()
    .withMessage("شناسه گفت‌وگو الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه گفت‌وگو معتبر نیست"),

  handleValidationErrors,
];

export const validateRemoveMessage = [
  param("chatId")
    .notEmpty()
    .withMessage("شناسه گفت‌وگو الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه گفت‌وگو معتبر نیست"),

  param("messageId")
    .notEmpty()
    .withMessage("شناسه پیام الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه پیام معتبر نیست"),

  handleValidationErrors,
];