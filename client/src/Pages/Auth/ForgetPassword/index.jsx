import { useState } from "react";
import { useNavigate } from "react-router-dom";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";
import OvalLoading from "../../../Components/Loading/OvalLoading";
import { motion } from "framer-motion";

export default function ForgetPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!phoneNumber.trim()) {
      notify("error", "لطفا شماره تلفن خود را وارد کنید");
      setLoading(false);
      return;
    }

    try {
      const result = await FetchData("auth/forget-password", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      if (!result.success) {
        notify("error", result.message);
        return;
      }

      notify("success", result.message);

      sessionStorage.setItem("forgetPasswordPhoneNumber", phoneNumber);

      navigate("/auth/forgot-password/verify");
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
              فراموشی رمز عبور
            </h1>

            <p className="text-sm text-gray-500">
              شماره تلفن خود را وارد کنید تا کد تایید برای شما ارسال شود
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
              {loading ? <OvalLoading strokeWidth={6} /> : "ارسال کد تایید"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            رمز عبور خود را به یاد آوردید؟
            <span
              onClick={() => navigate("/auth/register")}
              className="text-[#cba36f] font-medium mr-1 cursor-pointer hover:underline"
            >
              ورود به حساب
            </span>
          </p>
        </div>
      </div>
      ;
    </motion.div>
  );
}
