import { Router } from "express";

import {
  getAll,
  getOne,
  getMyProperty,
  create,
  update,
  remove,
  changeStatus,
  changeApprovalStatus,
  views,
  similarProperties,
} from "./propertyCn.js";

import {
  validateGetAll,
  validateGetOne,
  validateCreate,
  validateUpdate,
  validateRemove,
  validateChangeStatus,
  validateChangeApprovalStatus,
  validateViews,
  validateSimilarProperties,
} from "./propertyValidator.js";
import { protect } from "../../Middlewares/protect.js";
import { authorize } from "../../Middlewares/authorize.js";

const propertyRouter = Router();

propertyRouter.route("/").get(validateGetAll, getAll);

propertyRouter.route("/:id").get(validateGetOne, getOne);

propertyRouter.route("/:id/views").patch(validateViews, views);

propertyRouter
  .route("/:id/similar")
  .get(validateSimilarProperties, similarProperties);

propertyRouter
  .route("/seller/my-properties")
  .get(protect, authorize("seller"), getMyProperty);


propertyRouter
  .route("/")
  .post(protect, authorize("seller"), validateCreate, create);

propertyRouter
  .route("/:id")
  .patch(protect, authorize("seller"), validateUpdate, update);

propertyRouter
  .route("/:id")
  .delete(protect, authorize("seller"), validateRemove, remove);

propertyRouter
  .route("/:id/status")
  .patch(protect, authorize("seller"), validateChangeStatus, changeStatus);

propertyRouter
  .route("/:id/approval")
  .patch(
    protect,
    authorize("admin"),
    validateChangeApprovalStatus,
    changeApprovalStatus,
  );

export default propertyRouter;
