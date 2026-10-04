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

export const validateGetUser = [
  param("id")
    .notEmpty()
    .withMessage("شناسه کاربر الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه کاربر معتبر نیست"),
  handleValidationErrors,
];

export const validateUpdate = [
  body("name")
    .optional()
    .isString()
    .withMessage("نام باید یک رشته باشد")
    .trim(),
  body("address")
    .optional()
    .isString()
    .withMessage("آدرس باید یک رشته باشد")
    .trim(),
  body("profilePic")
    .optional()
    .isString()
    .withMessage("تصویر پروفایل باید یک رشته باشد")
    .trim(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("ایمیل معتبر نیست")
    .normalizeEmail(),
  handleValidationErrors,
];

export const validateChangePassword = [
  body("oldPassword").notEmpty().withMessage("رمز عبور فعلی الزامی است"),
  body("newPassword")
    .notEmpty()
    .withMessage("رمز عبور جدید الزامی است")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage(
      "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک و اعداد باشد",
    ),
  handleValidationErrors,
];

export const validateBlockUser = [
  param("id")
    .notEmpty()
    .withMessage("شناسه کاربر الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه کاربر معتبر نیست"),

  handleValidationErrors,
];

export const validateChangeSellerStatus = [
  param("id")
    .notEmpty()
    .withMessage("شناسه کاربر الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه کاربر معتبر نیست"),

  body("sellerStatus")
    .notEmpty()
    .withMessage("وضعیت فروشندگی الزامی است")
    .bail()
    .isIn(["pending", "approved", "reject"])
    .withMessage("وضعیت فروشندگی نامعتبر است"),

  handleValidationErrors,
];