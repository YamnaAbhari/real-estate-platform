import { catchAsync, HandleERROR } from "vanta-api";
import bcrypt from "bcryptjs";
import { sendAuthCode, verifyCode } from "../../Utils/smsHandler.js";
import User from "../User/userMd.js";
import jwt from "jsonwebtoken";

/** Registers a user and sends an OTP for phone verification. */
export const register = catchAsync(async (req, res, next) => {
  const {
    name,
    phoneNumber,
    password,
    role,
  } = req.body;


  const validations = {
    name: "لطفاً نام خود را وارد کنید",
    phoneNumber: "لطفاً شماره تلفن را وارد کنید",
    password: "لطفاً رمز عبور را وارد کنید",
  };

  for (const [field, message] of Object.entries(validations)) {
    if (!req.body[field]) {
      return next(new HandleERROR(message, 400));
    }
  }

 
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passRegex.test(password)) {
    return next(
      new HandleERROR(
        "رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، حروف کوچک و اعداد باشد",
        400,
      ),
    );
  }

  
  if (role && !["buyer", "seller"].includes(role)) {
    return next(
      new HandleERROR("نقش کاربر نامعتبر است", 400),
    );
  }



  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.findOne({ phoneNumber });


  if (user && user.isVerified) {
    return next(
      new HandleERROR("این شماره تلفن قبلاً ثبت شده است", 409),
    );
  }


  if (user && !user.isVerified) {
    user.name = name;
    user.password = hashPassword;


    if (role) {
      user.role = role;
      user.sellerStatus =
        role === "seller" ? "pending" : "approved";
    }

    await user.save();

    const sendSms = await sendAuthCode(phoneNumber);

    if (!sendSms.success) {
      return next(
        new HandleERROR(sendSms.message, 500),
      );
    }

    return res.status(200).json({
      success: true,
      message: "کد تأیید ارسال شد",
      data: {
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
    });
  }

  const newUser = await User.create({
    name,
    phoneNumber,
    password: hashPassword,
    isVerified: false,
    role: role || "buyer",
    sellerStatus:
      role === "seller" ? "pending" : "approved",
  });

 
  const sendSms = await sendAuthCode(phoneNumber);

  if (!sendSms.success) {
    return next(
      new HandleERROR(sendSms.message, 500),
    );
  }

  return res.status(201).json({
    success: true,
    message: "کد تأیید ارسال شد",
    data: {
      phoneNumber: newUser.phoneNumber,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
    },
  });
});

/** Authenticates a verified, active user and returns an access token. */
export const login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return next(
      new HandleERROR("لطفاً شماره تلفن و رمز عبور را وارد کنید.", 400),
    );
  }

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("کاربری با این شماره تلفن یافت نشد", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new HandleERROR("رمز عبور وارد شده صحیح نیست.", 400));
  }

  if (!user.isVerified) {
    return next(new HandleERROR("شماره تلفن شما هنوز تأیید نشده است", 403));
  }

  if (user.isBlocked) {
    return next(
      new HandleERROR(
        "حساب کاربری شما مسدود شده است.",
        403,
      ),
    );
  }

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "30d" },
  );
  return res.status(200).json({
    success: true,
    message: "ورود با موفقیت انجام شد",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePic: user.profilePic,
        isBlocked: user.isBlocked,
        isVerified: user.isVerified,
        sellerStatus: user.sellerStatus,
      },
    },
  });
});

/** Verifies an OTP for registration or password-reset requests. */
export const verifyOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, code, purpose } = req.body;
  if (!phoneNumber || !code) {
    return next(new HandleERROR("شماره تلفن و کد تأیید الزامی است", 400));
  }

  if (!["register", "forgotPassword"].includes(purpose)) {
    return next(new HandleERROR("نوع درخواست نامعتبر است", 400));
  }

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("کاربری با این شماره تلفن یافت نشد", 404));
  }

  const verifyOtp = await verifyCode(phoneNumber, code);
  if (!verifyOtp.success) {
    return next(new HandleERROR(verifyOtp.message, 500));
  }

  if (purpose === "register") {
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "شماره تلفن با موفقیت تأیید شد",
    });
  }

  if (purpose === "forgotPassword") {
    const resetToken = jwt.sign(
      { _id: user._id, purpose: "resetPassword" },
      process.env.SECRET_KEY,
      { expiresIn: "10m" },
    );

    return res.status(200).json({
      success: true,
      message: "کد تأیید شد",
      data: {
        resetToken,
      },
    });
  }
});

/** Sends a password-reset OTP to a registered phone number. */
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("کاربری با این شماره تلفن یافت نشد", 404));
  }

  const sendSms = await sendAuthCode(phoneNumber);
  if (!sendSms.success) {
    return next(new HandleERROR(sendSms.message, 500));
  }

  return res.status(200).json({
    success: true,
    message: "کد  تأیید ارسال شد",
  });
});

/** Resets a user's password using a valid password-reset token. */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword, resetToken } = req.body;
  if (!resetToken) {
    return next(new HandleERROR("دسترسی غیرمجاز است", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.SECRET_KEY);
  } catch (error) {
    return next(
      new HandleERROR("دسترسی تغییر رمز نامعتبر یا منقضی شده است", 401),
    );
  }
  if (decoded.purpose !== "resetPassword") {
    return next(new HandleERROR("توکن نامعتبر است", 401));
  }

  const user = await User.findById(decoded._id);
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

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "رمز عبور با موفقیت تغییر کرد",
  });
});

/** Resends an OTP to the supplied phone number. */
export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const sendSms = await sendAuthCode(phoneNumber);
  if (!sendSms.success) {
    return next(new HandleERROR(sendSms.message, 500));
  }

  return res.status(200).json({
    success: true,
    message: "کد تأیید با موفقیت ارسال شد",
  });
});
