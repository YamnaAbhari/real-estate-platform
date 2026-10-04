import { Router } from "express";
import {
  register,
  login,
  verifyOtp,
  forgetPassword,
  resetPassword,
  resendCode,
} from "./authCn.js";
import {
  validateRegister,
  validateLogin,
  validateVerifyOtp,
  validateForgetPassword,
  validateResetPassword,
  validateResendCode,
} from "./authValidator.js";

const authRouter = Router();

authRouter.route("/register").post(validateRegister, register);
authRouter.route("/login").post(validateLogin, login);
authRouter.route("/verify-otp").post(validateVerifyOtp, verifyOtp);
authRouter.route("/forget-password").post(validateForgetPassword, forgetPassword);
authRouter.route("/reset-password").post(validateResetPassword, resetPassword);
authRouter.route("/resend-code").post(validateResendCode, resendCode);

export default authRouter;