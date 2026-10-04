export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "شما اجازه دسترسی به این بخش را ندارید"
      });
    }

    next();
  };
};