import jwt from "jsonwebtoken";
import User from "../Modules/User/userMd.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "توکن احراز هویت یافت نشد",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    const user = await User.findById(decoded._id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success:false,
        message:"کاربر یافت نشد"
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success:false,
        message:"حساب کاربری شما توسط مدیر سیستم مسدود شده است"
      });
    }

    req.user = user;
    req.role = user.role;

    next();

  } catch (error) {
    return res.status(401).json({
      success:false,
      message:"توکن نامعتبر یا منقضی شده است"
    });
  }
};



export const optionalProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    const user = await User.findById(decoded._id)
      .select("-password");

    if (!user) {
      return next();
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "حساب کاربری شما توسط مدیر سیستم مسدود شده است",
      });
    }

    req.user = user;
    req.role = user.role;

    next();

  } catch (error) {
    next();
  }
};

