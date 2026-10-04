import { Router } from "express";
import { getAll, create, markAsRead } from "./contactCn.js";
import { validateGetAll, validateCreate } from "./contactValidator.js";
import { authorize } from "../../Middlewares/authorize.js";
import { optionalProtect, protect } from "../../Middlewares/protect.js";


const contactRouter = Router();

contactRouter.route("/")
  .get(protect, authorize("admin"), validateGetAll, getAll)
  .post(optionalProtect,validateCreate, create);

  contactRouter.patch(
  "/:id/read",
  protect,
  authorize("admin"),
  markAsRead,
);

export default contactRouter;