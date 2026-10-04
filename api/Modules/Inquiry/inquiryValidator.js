import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

export const validateGetAll = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("صفحه باید عددی مثبت باشد")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("محدودیت باید بین ۱ تا ۱۰۰ باشد")
    .toInt(),
  query("sort")
    .optional()
    .isString().withMessage("مرتب‌سازی باید رشته باشد"),
  query("fields")
    .optional()
    .isString().withMessage("فیلدها باید رشته باشند"),
  handleValidationErrors,
];
export const validateSendInquiry = [
  body("propertyId")
    .notEmpty().withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId().withMessage("شناسه ملک معتبر نیست"),
  body("message")
    .notEmpty().withMessage("پیام الزامی است")
    .bail()
    .isString().withMessage("پیام باید یک رشته باشد")
    .trim(),
  handleValidationErrors,
];

export const validateMarkAsRead = [
  param("id")
    .notEmpty().withMessage("شناسه جست‌وجو الزامی است")
    .bail()
    .isMongoId().withMessage("شناسه جست‌وجو معتبر نیست"),
  handleValidationErrors,
];