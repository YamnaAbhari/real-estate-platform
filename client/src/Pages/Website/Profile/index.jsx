

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCamera,
  FaLock,
  FaSave,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import useFormFields from "../../../Hooks/useFormFields";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";
import { updateUser } from "../../../Store/AuthSlice";
import usePasswordVisibility from "../../../Hooks/usePasswordVisibility";
import {motion} from 'framer-motion'

export default function Profile() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch=useDispatch()
 

  // ================= PROFILE FIELDS =================

  const [fields, handleChange, setFields] = useFormFields({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
  });
  const { name, email, address } = fields;

  // ================= PASSWORD FIELDS =================
  const [passwordFields, handlePasswordChange, setPasswordFields] =
    useFormFields({
      oldPassword: "",
      newPassword: "",
    });

  const { oldPassword, newPassword } = passwordFields;
    const [passVisibility, handlePassVisibility] = usePasswordVisibility({
    password: false,
    confirmPassword: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);


  // PROFILE IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify("error", "حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    setProfileImage(file);
  };


  // UPDATE PROFILE
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      let profilePic = user?.profilePic || "";

      // ================= UPLOAD IMAGE =================

      if (profileImage) {
        const formData = new FormData();

        formData.append("file", profileImage);

        const imagesRes = await FetchData("uploads", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imagesRes.success) {
          notify("error", imagesRes.message || "آپلود تصویر انجام نشد");
          return;
        }

        const uploadedImages = imagesRes.data;
        console.log(uploadedImages);
        profilePic = uploadedImages;

        if (!profilePic) {
          notify("error", "مسیر تصویر دریافت نشد");
          return;
        }
      }

           // =========== Remove empty fields ===========
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => {
        if (value === "" || value === null || value === undefined) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );
      // ================= UPDATE USER =================

      const result = await FetchData("users/update", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cleanFields,
          profilePic,
        }),
      });

      if (!result.success) {
        notify("error", result.message || "بروزرسانی پروفایل انجام نشد");
        return;
      }

      notify(
        "success",
        result.message || "اطلاعات پروفایل با موفقیت بروزرسانی شد",
      );


      if (result.data) {
        setFields({
          name: result.data.name || "",
          email: result.data.email || "",
          address: result.data.address || "",
        });
        dispatch(updateUser(result.data));
      }
    } catch (error) {
      console.log("PROFILE UPDATE ERROR:", error);
      notify("error", "خطا در بروزرسانی پروفایل");
    } finally {
      setLoading(false);
    }
  };


  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      notify("error", "رمز عبور فعلی و رمز عبور جدید را وارد کنید");
      return;
    }

    try {
      setPasswordLoading(true);

      const result = await FetchData("users/change-password", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!result.success) {
        notify("error", result.message || "تغییر رمز عبور انجام نشد");
        return;
      }

      notify("success", result.message || "رمز عبور با موفقیت تغییر کرد");

      setPasswordFields({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.log("PASSWORD ERROR:", error);
      notify("error", "خطا در تغییر رمز عبور");
    } finally {
      setPasswordLoading(false);
    }
  };


  return (
  <motion.div
    dir="rtl"
    className="min-h-screen bg-[#f8f8f8] px-6 py-30"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {/* ================= HEADER ================= */}
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-alibaba text-xl font-bold text-dark-blue">
        پروفایل من
      </h2>

      <p className="mt-1 font-iranYekan text-sm text-gray-500">
        اطلاعات حساب کاربری و تنظیمات پروفایل خود را مدیریت کنید
      </p>
    </motion.div>

    {/* ================= PROFILE ================= */}
    <motion.div
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {/* ================= PROFILE IMAGE ================= */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 40, scale: 0.96 },
          show: { opacity: 1, x: 0, scale: 1 },
        }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-100">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : user?.profilePic ? (
                <img
                  src={`${import.meta.env.VITE_BASE_FILE + user.profilePic}`}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-5xl text-gray-400" />
              )}
            </div>

            <label
              htmlFor="profile-image"
              className="absolute bottom-1 left-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-dark-blue text-gold shadow-md transition hover:scale-105"
            >
              <FaCamera />

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <h3 className="mt-4 font-alibaba text-lg font-bold text-dark-blue">
            {name || "کاربر"}
          </h3>

          <p className="mt-1 font-iranYekan text-sm text-gray-500">
            {email || "ایمیل ثبت نشده"}
          </p>

          <p className="mt-4 text-center font-iranYekan text-xs text-gray-400">
            برای تغییر تصویر پروفایل روی آیکون دوربین کلیک کنید
          </p>
        </div>
      </motion.div>

      {/* ================= PERSONAL INFORMATION ================= */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -40, scale: 0.96 },
          show: { opacity: 1, x: 0, scale: 1 },
        }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2"
      >
        <h3 className="mb-6 font-alibaba text-lg font-bold text-dark-blue">
          اطلاعات شخصی
        </h3>

                 <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-2 block font-iranYekan text-sm text-gray-600">
                نام و نام خانوادگی
              </label>

              <div className="relative">
                <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="نام و نام خانوادگی"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-[#cba36f] focus:bg-white focus:ring-2 focus:ring-[#cba36f]/20"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block font-iranYekan text-sm text-gray-600">
                ایمیل
              </label>

              <div className="relative">
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="ایمیل"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-[#cba36f] focus:bg-white focus:ring-2 focus:ring-[#cba36f]/20"
                />
              </div>
            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">
              <label className="mb-2 block font-iranYekan text-sm text-gray-600">
                آدرس
              </label>

              <div className="relative">
                <FaMapMarkerAlt className="absolute right-4 top-4 text-gray-400" />

                <textarea
                  name="address"
                  value={address}
                  onChange={handleChange}
                  placeholder="آدرس خود را وارد کنید"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 pt-3 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-[#cba36f] focus:bg-white focus:ring-2 focus:ring-[#cba36f]/20"
                />
              </div>
            </div>
          </div>

          {/* SAVE PROFILE */}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex h-11 items-center gap-2 rounded-xl bg-dark-blue px-6 font-iranYekan text-sm font-medium text-gold shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSave />

              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>

      </motion.div>
    </motion.div>

    {/* ================= CHANGE PASSWORD ================= */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.35,
      }}
      className="mt-6 rounded-2xl bg-white p-6 shadow-sm"
    >
        <div className="mb-6">
          <h3 className="font-alibaba text-lg font-bold text-dark-blue">
            تغییر رمز عبور
          </h3>

          <p className="mt-1 font-iranYekan text-sm text-gray-500">
            برای تغییر رمز عبور، رمز فعلی و رمز عبور جدید را وارد کنید
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* OLD PASSWORD */}

          
         <div>
             <label className="mb-2 block font-iranYekan text-sm text-gray-600">
              رمز عبور فعلی
            </label>

            <div className="relative">
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={passVisibility.password?'text':'password'}
                name="oldPassword"
                value={oldPassword}
                onChange={handlePasswordChange}
                placeholder="رمز عبور فعلی"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-[#cba36f] focus:bg-white focus:ring-2 focus:ring-[#cba36f]/20"
              />

               <button
                type="button"
                onClick={() => handlePassVisibility("password")}
                className="absolute left-4 top-2.5
                         translate-y-[35%]
                         text-slate-500
                         cursor-pointer"
              >
                {passVisibility.password ? (
                  <FaRegEye />
                ) : (
                  <FaRegEyeSlash />
                )}
              </button>
            </div>
         </div>
          

          {/* NEW PASSWORD */}

          <div>
            <label className="mb-2 block font-iranYekan text-sm text-gray-600">
              رمز عبور جدید
            </label>

            <div className="relative">
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                 type={passVisibility.confirmPassword?'text':'password'}
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="حداقل ۸ کاراکتر، حروف بزرگ، کوچک و عدد"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-[#cba36f] focus:bg-white focus:ring-2 focus:ring-[#cba36f]/20"
              />

                <button
                type="button"
                onClick={() => handlePassVisibility("confirmPassword")}
                className="absolute left-4 top-2.5
                         translate-y-[35%]
                         text-slate-500
                         cursor-pointer"
              >
                {passVisibility.confirmPassword ? (
                  <FaRegEye />
                ) : (
                  <FaRegEyeSlash />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD BUTTON */}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="flex h-11 items-center gap-2 rounded-xl bg-dark-blue px-6 font-iranYekan text-sm font-medium text-gold shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaLock />

            {passwordLoading ? "در حال تغییر..." : "تغییر رمز عبور"}
          </button>
        </div>
    </motion.div>
  </motion.div>
);
}
