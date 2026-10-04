import { Router } from "express";
import {
  getAll,
  getMe,
  getUser,
  update,
  changePassword,
  getPendingSellers,
  blockUser,
  changeSellerStatus,
} from "./userCn.js";
import {
  validateGetAll,
  validateGetUser,
  validateUpdate,
  validateChangePassword,
  validateBlockUser,
  validateChangeSellerStatus,
} from "./userValidator.js";
import { authorize } from "../../Middlewares/authorize.js";
import { protect } from "../../Middlewares/protect.js";

const userRouter = Router();

userRouter.route("/").get(authorize("admin"), validateGetAll, getAll);
userRouter.route("/me").get(getMe);
userRouter.route("/update").patch(validateUpdate, update);
userRouter
  .route("/change-password")
  .patch(validateChangePassword, changePassword);
userRouter.get("/pending-sellers", validateGetAll, getPendingSellers);
userRouter.patch("/:id/block",authorize("admin"), validateBlockUser, blockUser);
userRouter.patch(
  "/:id/seller-status",
  authorize("admin"),
  validateChangeSellerStatus,
  changeSellerStatus,
);
userRouter.route("/:id").get(authorize("admin"), validateGetUser, getUser);

export default userRouter;
