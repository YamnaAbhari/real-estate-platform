import { Router } from "express";
import { protect } from "../../Middlewares/protect.js";
import { authorize } from "../../Middlewares/authorize.js";
import { getDashboardState, getPropertyTypeCounts, getSellerDashboard } from "./reportCn.js";

const reportRouter=Router()

reportRouter
  .route("/seller/dashboard")
  .get(protect, authorize("seller"), getSellerDashboard);

  reportRouter
  .route("/properties/counts")
  .get(
    protect,
    authorize("admin"),
    getPropertyTypeCounts
  );

  reportRouter.route("/admin/dashboard").get(protect, authorize("admin"), getDashboardState);

  export default reportRouter