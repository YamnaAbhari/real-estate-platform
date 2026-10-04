import { param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

export const validateGetMyWishlist = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("sort")
    .optional()
    .isString().withMessage("Sort must be a string"),
  query("fields")
    .optional()
    .isString().withMessage("Fields must be a string"),
  handleValidationErrors,
];

export const validatePropertyId = [
  param("propertyId")
    .notEmpty().withMessage("شناسه ملک الزامی است")
    .bail()
    .isMongoId().withMessage("شناسه ملک معتبر نیست"),
  handleValidationErrors,
];