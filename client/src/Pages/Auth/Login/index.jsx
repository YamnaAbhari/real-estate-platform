import { useState } from "react";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/AuthSlice";
import OvalLoading from "../../../Components/Loading/OvalLoading";
import usePasswordVisibility from "../../../Hooks/usePasswordVisibility";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passVisibility, handlePassVisibility] = usePasswordVisibility({
    password: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!phoneNumber.trim()) {
      setLoading(false);
      notify("error", "شماره تلفن خود را وارد کنید");
      return;
    }
    if (!password.trim()) {
      setLoading(false);
      notify("error", "رمز عبور خود را وارد کنید");
      return;
    }

    const result = await FetchData("auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        password,
      }),
    });
    if (!result.success) {
      notify("error", result.message);
      setLoading(false);
      return;
    }
    if (result.success) {
      notify("success", result.message);
      sessionStorage.removeItem("registerPhoneNumber");
      dispatch(login(result.data));
      navigate("/");
    }
  };
  return    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    > <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4 font-iranYekan">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[] mb-3 font-alibaba">
          ورود به حساب کاربری
        </h1>

        <p className="text-sm text-gray-500">
          برای ورود، شماره تلفن و رمز عبور خود را وارد کنید
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره تلفن
          </label>

          <input
            type="tel"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Forgot Password */}
<div className="flex justify-start -mt-2">
  <span
    onClick={() => navigate("/auth/forgot-password")}
    className="text-[13px] text-[#cba36f] cursor-pointer 
               hover:underline"
  >
    رمز عبور را فراموش کرده‌اید؟
  </span>
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
          {loading ? <OvalLoading strokeWidth={6} /> : "ورود"}
        </button>
      </form>

      {/* Login */}
      <p className="text-center text-sm text-gray-500 mt-6">
        حساب کاربری ندارید؟
        <span
          onClick={() => navigate("/auth/register")}
          className="text-[#cba36f] font-medium mr-1 cursor-pointer hover:underline"
        >
          ثبت نام کنید
        </span>
      </p>
    </div>
  </div>;</motion.div>
}


