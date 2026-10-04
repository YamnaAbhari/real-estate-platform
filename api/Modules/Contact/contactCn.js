import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Contact from "./contactMd.js";
import sendEmail from "../../Utils/sendEmail.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Contact, req.query, req.role)
    .filter()
    .limitFields()
    .sort()
    .populate({ path: "userId", select: "profilePic name email phoneNumber" })
    .paginate();

  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const { name, phoneNumber, email, subject, message } = req.body;

  
  const validations = {
    name: "لطفاً نام خود را وارد کنید",
    phoneNumber: "لطفاً شماره تلفن را وارد کنید",
    email: "لطفاً ایمیل خود را وارد کنید",
    subject: "لطفاً موضوع خود را وارد کنید",
    message: "لطفاً  پیام خود را وارد کنید",
  };

 for (const [field, message] of Object.entries(validations)) {
    if (!req.body[field]) {
      return next(new HandleERROR(message, 400));
    }
  }

     const contact = await Contact.create({
     userId:req.user?._id,
      name,
      email,
      phoneNumber,
      subject,
      message,
    })

    await sendEmail({
      to: process.env.ADMIN_EMAIL,

      subject: `پیام جدید از ${name}`,

      html: `
        <div style="font-family: Arial; direction: rtl;">
          <h2>پیام جدید از فرم تماس</h2>

          <p>
            <strong>نام:</strong>
            ${name}
          </p>

          <p>
            <strong>ایمیل:</strong>
            ${email}
          </p>

          <p>
            <strong>شماره تماس:</strong>
            ${phoneNumber || "وارد نشده"}
          </p>

          <hr />

          <h3>پیام کاربر:</h3>
          
          <p>
          <strong>موضوع:</strong>
            ${subject}
          </p>

          <p>
            ${message}
          </p>
        </div>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "پیام شما با موفقیت ارسال شد",
      data:contact,
    });
});



export const markAsRead = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new HandleERROR("پیام پیدا نشد", 404));
  }

  contact.status = "read";

  await contact.save();

  return res.status(200).json({
    success: true,
    message: "پیام به عنوان خوانده‌شده علامت خورد",
    data: contact,
  });
});