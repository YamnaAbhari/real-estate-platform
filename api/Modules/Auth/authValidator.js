import { body } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

export const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("لطفاً نام خود را وارد کنید")
    .bail()
    .isString()
    .withMessage("نام باید یک رشته باشد")
    .trim(),
  body("phoneNumber")
    .notEmpty()
    .withMessage("لطفاً شماره تلفن را وارد کنید")
    .bail()
    .matches(/^09\d{9}$/)
    .withMessage("شماره تلفن معتبر نیست"),
  body("password")
    .notEmpty()
    .withMessage("لطفاً رمز عبور را وارد کنید")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage(
      "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک و اعداد باشد",
    ),
  body("role")
    .optional()
    .isIn(["buyer", "seller"])
    .withMessage("نقش کاربر نامعتبر است"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("ایمیل معتبر نیست")
    .normalizeEmail(),
  handleValidationErrors,
];

export const validateLogin = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("لطفاً شماره تلفن را وارد کنید")
    .bail()
    .matches(/^09\d{9}$/)
    .withMessage("شماره تلفن معتبر نیست"),
  body("password").notEmpty().withMessage("لطفاً رمز عبور را وارد کنید"),
  handleValidationErrors,
];

export const validateVerifyOtp = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("شماره تلفن الزامی است")
    .bail()
    .matches(/^09\d{9}$/)
    .withMessage("شماره تلفن معتبر نیست"),
  body("code")
    .notEmpty()
    .withMessage("کد تأیید الزامی است")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("کد تأیید باید ۶ رقم باشد")
    .bail()
    .isNumeric()
    .withMessage("کد تأیید باید فقط عدد باشد"),
  body("purpose")
    .notEmpty()
    .withMessage("نوع درخواست الزامی است")
    .bail()
    .isIn(["register", "forgotPassword"])
    .withMessage("نوع درخواست نامعتبر است"),
  handleValidationErrors,
];

export const validateForgetPassword = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("شماره تلفن الزامی است")
    .bail()
    .matches(/^09\d{9}$/)
    .withMessage("شماره تلفن معتبر نیست"),
  handleValidationErrors,
];

export const validateResetPassword = [
  body("resetToken").notEmpty().withMessage("توکن بازنشانی الزامی است"),
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

export const validateResendCode = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("شماره تلفن الزامی است")
    .bail()
    .matches(/^09\d{9}$/)
    .withMessage("شماره تلفن معتبر نیست"),
  handleValidationErrors,
];
