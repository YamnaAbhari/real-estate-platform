import { useState } from "react";
import useFormFields from "../../../Hooks/useFormFields";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";
import { useNavigate } from "react-router-dom";
import OvalLoading from "../../../Components/Loading/OvalLoading";
import usePasswordVisibility from "../../../Hooks/usePasswordVisibility";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Register() {
  const [fields, handleChange] = useFormFields({
    name: "",
    phoneNumber: "",
    password: "",
  });

  const { name, phoneNumber, password } = fields;
  const [role, setRole] = useState("buyer");
  const [passVisibility, handlePassVisibility] = usePasswordVisibility({
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim()) {
      notify("error", "لطفا نام کامل خود را وارد کنید");
      setLoading(false);
      return;
    }
    if (!phoneNumber.trim()) {
      notify("error", "لطفا شماره تلفن خود را وارد کنید");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      notify("error", "لطفا رمز عبور خود را وارد کنید");
      setLoading(false);
      return;
    }

    try {
      const result = await FetchData("auth/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, phoneNumber, password, role }),
      });

      if (!result.success) {
        notify("error", result.message);
        setLoading(false);
        return;
      }
      if (result.success) {
        notify("success", result.message);
        sessionStorage.setItem("registerPhoneNumber", phoneNumber);
        navigate("/auth/register/verify");
      }
    } catch (error) {
      notify("error", "خطایی در ارسال کد تایید رخ داد");
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
            <h1 className="text-3xl font-bold text-[#141D43] mb-3 font-alibaba">
              ایجاد حساب کاربری
            </h1>

            <p className="text-sm text-gray-500">
              برای شروع، اطلاعات خود را وارد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام کامل
              </label>

              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="نام و نام خانوادگی"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm
                       outline-none transition-all
                       focus:border-[#cba36f]
                       focus:ring-2 focus:ring-[#cba36f]/20
                       placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره تلفن
              </label>

              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                dir="ltr"
                className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm
                       outline-none transition-all
                       focus:border-[#cba36f]
                       focus:ring-2 focus:ring-[#cba36f]/20
                       placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>

              <input
                type={passVisibility.password ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="رمز عبور خود را وارد کنید"
                dir="ltr"
                className="w-full h-12 px-4 rounded-xl border border-gray-200
              text-sm
                       outline-none transition-all
                       focus:border-[#cba36f]
                       focus:ring-2 focus:ring-[#cba36f]/20
                       placeholder:text-gray-400"
              />

              <button
                type="button"
                onClick={() => handlePassVisibility("password")}
                className="absolute right-4 top-[50%] translate-y-[35%] my-auto text-slate-500 cursor-pointer"
              >
                {passVisibility.password ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع حساب
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Buyer */}
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`h-12 rounded-xl border transition-all font-medium cursor-pointer
                ${
                  role === "buyer"
                    ? "bg-[#cba36f2e] text-gray-500 border-[#cba36f] border shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#cba36f]"
                }`}
                >
                  خریدار
                </button>

                {/* Seller */}
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`h-12 rounded-xl border transition-all font-medium cursor-pointer
                ${
                  role === "seller"
                    ? "bg-[#cba36f2e] text-gray-500 border-[#cba36f] border shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#cba36f]"
                }`}
                >
                  فروشنده
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-xl bg-[#cba36f] text-white cursor-pointer
                     font-semibold text-base flex justify-center items-center
                     transition-all duration-200
                     hover:bg-[#b9915d]
                     hover:shadow-lg
                     active:scale-[0.98]
                     disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <OvalLoading strokeWidth={6} /> : "ثبت نام"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            قبلاً حساب کاربری دارید؟
            <span
              onClick={() => navigate("/auth/login")}
              className="text-[#cba36f] font-medium mr-1 cursor-pointer hover:underline"
            >
              ورود
            </span>
          </p>
        </div>
      </div>{" "}
    </motion.div>
  );
}
