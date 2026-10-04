import { Router } from "express";
import {
  getAllChats,
  getOneChat,
  createChat,
  removeChat,
} from "./chatCn.js";
import {
    validateCreateChat,
  validateGetAll,
  validateGetOneChat,
  validateRemoveChat,

} from "./chatValidator.js";


const chatRouter = Router();

chatRouter.route("/")
  .get(validateGetAll, getAllChats)
  .post(validateCreateChat, createChat);

chatRouter.route("/:id")
  .get(validateGetOneChat, getOneChat)
  .delete(validateRemoveChat,removeChat)

export default chatRouter;