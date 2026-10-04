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

export const validateGetOne = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  handleValidationErrors,
];

export const validateCreate = [
  body("title")
    .notEmpty()
    .withMessage("عنوان ملک الزامی است")
    .bail()
    .isString()
    .withMessage("عنوان باید یک رشته باشد")
    .trim(),
  body("description")
    .notEmpty()
    .withMessage("توضیحات ملک الزامی است")
    .bail()
    .isString()
    .withMessage("توضیحات باید یک رشته باشد")
    .trim(),
  body("price")
    .notEmpty()
    .withMessage("قیمت ملک الزامی است")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("قیمت باید عددی مثبت باشد"),
  body("province")
    .notEmpty()
    .withMessage("استان الزامی است")
    .bail()
    .isString()
    .withMessage("استان باید یک رشته باشد")
    .trim(),
  body("city")
    .notEmpty()
    .withMessage("شهر الزامی است")
    .bail()
    .isString()
    .withMessage("شهر باید یک رشته باشد")
    .trim(),
  body("district")
    .optional()
    .isString()
    .withMessage("منطقه باید یک رشته باشد")
    .trim(),
  body("propertyType")
    .notEmpty()
    .withMessage("نوع ملک الزامی است")
    .bail()
    .isIn([
      "apartment",
      "villa",
      "office",
      "shop",
      "land",
      "warehouse",
    ])
    .withMessage("نوع ملک نامعتبر است"),
  body("listingType")
    .notEmpty()
    .withMessage("نوع آگهی الزامی است")
    .bail()
    .isIn(["sale", "rent"])
    .withMessage("نوع آگهی باید فروش یا اجاره باشد"),
  body("area")
    .notEmpty()
    .withMessage("متراژ الزامی است")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("متراژ باید عددی مثبت باشد"),
  body("images").optional().isArray().withMessage("تصاویر باید یک آرایه باشد"),
  body("images.*").isString().withMessage("هر تصویر باید یک رشته باشد"),
  handleValidationErrors,
];

export const validateUpdate = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  body("title")
    .optional()
    .isString()
    .withMessage("عنوان باید یک رشته باشد")
    .trim(),
  body("description")
    .optional()
    .isString()
    .withMessage("توضیحات باید یک رشته باشد")
    .trim(),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("قیمت باید عددی مثبت باشد"),
  body("province")
    .optional()
    .isString()
    .withMessage("استان باید یک رشته باشد")
    .trim(),
  body("city")
    .optional()
    .isString()
    .withMessage("شهر باید یک رشته باشد")
    .trim(),
  body("district")
    .optional()
    .isString()
    .withMessage("منطقه باید یک رشته باشد")
    .trim(),
  body("propertyType")
    .optional()
    .isIn([
      "apartment",
      "villa",
      "office",
      "shop",
      "land",
      "warehouse",
    ])
    .withMessage("نوع ملک نامعتبر است"),
  body("listingType")
    .optional()
    .isIn(["sale", "rent"])
    .withMessage("نوع آگهی باید فروش یا اجاره باشد"),
  body("area")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("متراژ باید عددی مثبت باشد"),
  body("floor")
    .optional()
    .isInt({ min: 0 })
    .withMessage("طبقه باید عددی مثبت باشد"),
  body("yearBuilt")
    .optional()
    .isInt({ min: 1300, max: 1500 })
    .withMessage("سال ساخت معتبر نیست"),
  body("bedrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("تعداد اتاق خواب باید عددی مثبت باشد"),
  body("furnishing")
    .optional()
    .isIn(["furnished", "unfurnished",])
    .withMessage("وضعیت مبله بودن نامعتبر است"),
  body("amenities")
    .optional()
    .isArray()
    .withMessage("امکانات باید یک آرایه باشد"),
  body("amenities.*").isString().withMessage("هر امکانات باید یک رشته باشد"),
  body("status")
    .optional()
    .isIn(["available", "sold", "rented"])
    .withMessage("وضعیت ملک نامعتبر است"),
  body("images").optional().isArray().withMessage("تصاویر باید یک آرایه باشد"),
  body("images.*").isString().withMessage("هر تصویر باید یک رشته باشد"),
  handleValidationErrors,
];

export const validateRemove = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  handleValidationErrors,
];

export const validateChangeStatus = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  body("status")
    .notEmpty()
    .withMessage("وضعیت ملک الزامی است")
    .bail()
    .isIn(["available", "sold", "rented"])
    .withMessage("وضعیت ملک نامعتبر است"),
  handleValidationErrors,
];

export const validateChangeApprovalStatus = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  body("approvalStatus")
    .notEmpty()
    .withMessage("وضعیت تایید الزامی است")
    .bail()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("وضعیت تایید نامعتبر است"),
  handleValidationErrors,
];

export const validateViews = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  handleValidationErrors,
];

export const validateSimilarProperties = [
  param("id")
    .notEmpty()
    .withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId()
    .withMessage("شناسه ملک معتبر نیست"),
  handleValidationErrors,
];
