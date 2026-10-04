import { Router } from "express";
import {
  sendMessage,
  getMessage,
  markMessagesAsRead,
  removeMessage,
} from "./messageCn.js";
import {
  validateSendMessage,
  validateGetMessages,
  validateMarkMessagesAsRead,
  validateRemoveMessage,
} from "./messageValidator.js";

const messageRouter = Router({ mergeParams: true });

messageRouter
  .route("/")
  .get(validateGetMessages, getMessage)
  .post(validateSendMessage, sendMessage);

messageRouter
  .route("/read")
  .patch(validateMarkMessagesAsRead, markMessagesAsRead);

messageRouter.route("/:messageId").delete(validateRemoveMessage, removeMessage);
export default messageRouter;
