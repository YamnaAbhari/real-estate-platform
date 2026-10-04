import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "./userMd.js";
import fs from "fs";
import { __dirname } from "../../app.js";
import path from "path";
import bcrypt from "bcryptjs";

/** Returns a filtered, searchable, paginated list of users. */
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req?.query, req?.role)
    .filter()
    .search(["name", "phoneNumber"])
    .limitFields()
    .sort()
    .paginate();
  const result = await features.execute();
  return res.status(200).json(result);
});

/** Returns the authenticated user's profile without its password. */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return next(new HandleERROR("کاربر یافت نشد", 404));

  res.status(200).json({ status: "success", data: user });
});

/** Returns one user's profile without its password. */
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return next(new HandleERROR("کاربر یافت نشد", 404));

  res.status(200).json({ status: "success", data: user });
});

// Get all sellers with pending status (admin approval needed)
export const getPendingSellers = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req?.query, req?.role)
    .addManualFilters({
      sellerStatus: "pending",
      role: "seller",
    })
    .filter()
    .search(["name", "phoneNumber"])
    .limitFields()
    .sort()
    .paginate();

  const result = await features.execute();

  return res.status(200).json(result);
});

/** Updates the authenticated user's profile details and picture. */
export const update = catchAsync(async (req, res, next) => {
  const { name, address, profilePic, email } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  if (profilePic && user.profilePic && profilePic !== user.profilePic) {
    const oldPath = path.join(__dirname, "Public", user.profilePic);
    try {
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    } catch (error) {
      console.log(error);
    }
  }

  user.name = name ?? user.name;
  user.address = address ?? user.address;
  user.email = email ?? user.email;

  if (profilePic) {
    user.profilePic = profilePic;
  }

  const updateUser = await user.save();

  return res.status(200).json({
    success: true,
    message: "اطلاعات پروفایل با موفقیت بروزرسانی شد",
    data: updateUser,
  });
});

// Delete a user by ID
export const remove=catchAsync(async(req,res,next)=>{
  const user=await User.findByIdAndDelete(req.params.id)
   if (!user) {
        return next(new HandleERROR('کاربر یافت نشد', 404));
    }

  return res.status(200).json({
    success:true,
    message:'کاربر با موفقیت حذف شد'
  })
})

/** Changes the authenticated user's password after verifying the current one. */
export const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }
  const passRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/);
  if (!passRegex.test(newPassword)) {
    return next(
      new HandleERROR(
        "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک و اعداد باشد",
        400,
      ),
    );
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return next(new HandleERROR("رمز عبور فعلی صحیح نیست", 400));
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "رمز عبور با موفقیت تغییر کرد",
  });
});

// Block or unblock a user by ID (toggle isBlocked status)
export const blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }
  user.isBlocked = !user.isBlocked;
  await user.save();

  return res.status(200).json({
    success: true,
    message: user.isBlocked
      ? "دسترسی کاربر غیرفعال شد"
      : "دسترسی کاربر فعال شد",
    data: {
      isBlocked: user.isBlocked,
    },
  });
});


// Change seller status (pending/approved/reject) for a user
export const changeSellerStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new HandleERROR("کاربر یافت نشد", 404));
  }

  const allowedStatus = ["pending", "approved", "reject"];

  if (!allowedStatus.includes(req.body.sellerStatus)) {
    return next(new HandleERROR("وضعیت فروشندگی نامعتبر است", 400));
  }

  user.sellerStatus = req.body.sellerStatus;

  await user.save();

  return res.status(200).json({
    success: true,
   message:
  user.sellerStatus === "approved"
    ? "حساب فروشندگی کاربر تأیید شد"
    : user.sellerStatus === "reject"
      ? "درخواست فروشندگی کاربر رد شد"
      : "درخواست فروشندگی کاربر به حالت انتظار تغییر کرد",
    data: {
      sellerStatus: user.sellerStatus,
    },
  });
});