import { Router } from "express";
import {
  sendInquiry,
  getSellerInquires,
  markAsRead,
  getAllInquiries,
} from "./inquiryCn.js";
import {
  validateSendInquiry,
  validateMarkAsRead,
  validateGetAll,
} from "./inquiryValidator.js";
import { protect } from "../../Middlewares/protect.js";
import { authorize } from "../../Middlewares/authorize.js";

const inquiryRouter = Router();

inquiryRouter
  .route("/")
  .post(protect, authorize("buyer"), validateSendInquiry, sendInquiry)
  .get(protect, authorize("admin"), validateGetAll, getAllInquiries);
inquiryRouter
  .route("/seller")
  .get(protect, authorize("seller"), getSellerInquires);
inquiryRouter
  .route("/:id/read")
  .patch(protect, authorize("seller"), validateMarkAsRead, markAsRead);

export default inquiryRouter;
