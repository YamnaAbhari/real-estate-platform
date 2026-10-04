import { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import notify from "../../../../Utils/Notify";
import FetchData from "../../../../Utils/FetchData";
import OvalLoading from "../../../../Components/Loading/OvalLoading";
import useCountdown from "../../../../Hooks/useCountdown";
import { motion } from "framer-motion";

export default function VerifyForgotPasswordOtp() {
  const phoneNumber = sessionStorage.getItem("forgetPasswordPhoneNumber");
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resendDisabled, formattedTimer, startCountdown } = useCountdown(120);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!code) {
      notify("error", "کد تأیید را وارد کنید");
      setLoading(false);
      return;
    }
    const result = await FetchData("auth/verify-otp", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, code, purpose: "forgotPassword" }),
    });
    if (!result.success) {
      notify("error", result.message);
      setLoading(false);
      return;
    }
    if (result.success) {
      notify("success", result.message);
      sessionStorage.removeItem('forgetPasswordPhoneNumber')
      sessionStorage.setItem('resetPasswordToken',result.data.resetToken)
      navigate("/auth/forgot-password/reset");
    }
  };
  const resendCode = async () => {
    const result = await FetchData("auth/resend-code", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
      }),
    });

    notify(result.success ? "success" : "error", result.message);

    if (result.success) {
      setCode("");
      startCountdown(120);
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#141D43] font-alibaba">
              ارسال کد تأیید
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              کد تایید ارسال شده را وارد کنید
            </p>
          </div>

          <OTPInput
            value={code}
            onChange={setCode}
            numInputs={6}
            containerStyle={{
              direction: "ltr",
              display: "flex",
              justifyContent: "space-between",
            }}
            inputStyle="w-[12%]! h-10 sm:w-[12%]! sm:h-11 text-center text-[14px] sm:text-[16px] font-semibold rounded-lg  ring-1 ring-[#cba36f] focus:shadow-lg  outline-none transition-all
                       focus:border-[#cba36f]
                       focus:ring-2  outline-none transition-all select-none! user-select-none!"
            isInputNum={true}
            shouldAutoFocus={true}
            renderSeparator={<span></span>}
            renderInput={(props) => (
              <input {...props} style={{ userSelect: "none" }} />
            )}
          />

          <div className="flex flex-col items-center gap-2 my-4">
            <button
              type="button"
              disabled={resendDisabled}
              onClick={resendCode}
              className="px-3 py-2 rounded-[10px] cursor-pointer
               text-[12px] font-semibold
               transition-all duration-200
               border border-[#cba36f]
               text-[#cba36f]
               hover:bg-[#cba36f]
               hover:text-white
               disabled:border-[#cba36f]
               disabled:text-gray-400
               disabled:bg-gray-50
               disabled:cursor-not-allowed"
            >
              ارسال کد
            </button>

            <span className="text-xs text-gray-500">
              {formattedTimer} مانده تا دریافت مجدد کد
            </span>
          </div>

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
            {loading ? <OvalLoading strokeWidth={6} /> : "تأیید کد"}
          </button>
        </form>
      </div>
    </div>
       </motion.div>
  );
}
