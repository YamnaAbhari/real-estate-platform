import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import notify from "../../../../Utils/Notify";
import FetchData from "../../../../Utils/FetchData";
import OvalLoading from "../../../../Components/Loading/OvalLoading";
import usePasswordVisibility from "../../../../Hooks/usePasswordVisibility";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [passVisibility, handlePassVisibility] = usePasswordVisibility({
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      notify("error", "لطفا رمز عبور جدید را وارد کنید");
      return;
    }

    if (!confirmPassword.trim()) {
      notify("error", "لطفا تکرار رمز عبور را وارد کنید");
      return;
    }

    if (password.length < 8) {
      notify("error", "رمز عبور باید حداقل ۸ کاراکتر باشد");
      return;
    }

    if (password !== confirmPassword) {
      notify("error", "رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    const resetPasswordToken = sessionStorage.getItem("resetPasswordToken");

    if (!resetPasswordToken) {
      notify("error", "دسترسی تغییر رمز عبور معتبر نیست");

      navigate("/auth/forget-password");
      return;
    }

    setLoading(true);

    try {
      const result = await FetchData("auth/reset-password", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          resetToken: resetPasswordToken,
          newPassword: password,
        }),
      });

      if (!result.success) {
        notify("error", result.message);
        return;
      }

      notify("success", result.message || "رمز عبور با موفقیت تغییر کرد");

      sessionStorage.removeItem("resetPasswordToken");
      sessionStorage.removeItem("forgetPasswordPhoneNumber");

      navigate("/auth/login");
    } catch (error) {
      notify("error", "خطایی در تغییر رمز عبور رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4 font-iranYekan">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 font-alibaba">
              تغییر رمز عبور
            </h1>

            <p className="text-sm text-gray-500 leading-6">
              رمز عبور جدید خود را وارد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور جدید
              </label>

              <input
                type={passVisibility.password ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور جدید خود را وارد کنید"
                dir="ltr"
                className="w-full h-12 px-4 pr-12 rounded-xl
                         border border-gray-200
                         text-sm
                         outline-none
                         transition-all
                         focus:border-[#cba36f]
                         focus:ring-2
                         focus:ring-[#cba36f]/20
                         placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => handlePassVisibility("password")}
                className="absolute right-4 top-[50%]
                         translate-y-[35%]
                         text-slate-500
                         cursor-pointer"
              >
                {passVisibility.password ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تکرار رمز عبور
              </label>

              <input
                type={passVisibility.confirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="رمز عبور را دوباره وارد کنید"
                dir="ltr"
                className="w-full h-12 px-4 pr-12 rounded-xl
                         border border-gray-200
                         text-sm
                         outline-none
                         transition-all
                         focus:border-[#cba36f]
                         focus:ring-2
                         focus:ring-[#cba36f]/20
                         placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => handlePassVisibility("confirmPassword")}
                className="absolute right-4 top-[50%]
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-xl
                       bg-[#cba36f]
                       text-white
                       cursor-pointer
                       font-semibold
                       text-base
                       flex
                       justify-center
                       items-center
                       transition-all
                       duration-200
                       hover:bg-[#b9915d]
                       hover:shadow-lg
                       active:scale-[0.98]
                       disabled:opacity-60
                       disabled:cursor-not-allowed"
            >
              {loading ? <OvalLoading strokeWidth={6} /> : "تغییر رمز عبور"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            رمز عبور خود را به یاد آوردید؟
            <span
              onClick={() => navigate("/auth/login")}
              className="text-[#cba36f] font-medium mr-1
                       cursor-pointer hover:underline"
            >
              ورود به حساب
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
