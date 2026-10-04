import { body, query } from "express-validator";
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

export const validateCreate = [
  body("name")
    .notEmpty().withMessage("لطفاً نام خود را وارد کنید")
    .bail()
    .isString().withMessage("نام باید یک رشته باشد")
    .trim(),
  body("phoneNumber")
    .notEmpty().withMessage("لطفاً شماره تلفن را وارد کنید")
    .bail()
    .matches(/^09\d{9}$/).withMessage("شماره تلفن معتبر نیست"),
  body("email")
    .notEmpty().withMessage("لطفاً ایمیل خود را وارد کنید")
    .bail()
    .isEmail().withMessage("ایمیل معتبر نیست")
    .normalizeEmail(),
  body("subject")
    .notEmpty().withMessage("لطفاً موضوع خود را وارد کنید")
    .bail()
    .isString().withMessage("موضوع باید یک رشته باشد")
    .trim(),
  body("message")
    .notEmpty().withMessage("لطفاً پیام خود را وارد کنید")
    .bail()
    .isString().withMessage("پیام باید یک رشته باشد")
    .trim()
    .custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 250) {
        throw new Error("حداکثر ۲۵۰ کلمه مجاز است");
      }
      return true;
    }),
  handleValidationErrors,
];