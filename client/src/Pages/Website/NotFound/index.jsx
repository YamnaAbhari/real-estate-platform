import { FaHome, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0e1431] flex items-center justify-center px-6 font-iranYekan"
    >
      <div className="w-full max-w-3xl text-center">

        {/* 404 */}
        <div className="relative mb-6">

          <h1 className="text-[130px] sm:text-[170px] md:text-[200px] leading-none font-bold text-[#cba36f]/10 select-none">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl sm:text-8xl md:text-9xl font-bold text-[#cba36f]">
              404
            </span>
          </div>

        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          صفحه مورد نظر پیدا نشد!
        </h2>

        {/* Description */}
        <p className="text-white/60 text-sm sm:text-base leading-8 max-w-xl mx-auto">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد،
          حذف شده یا آدرس آن اشتباه وارد شده است.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto min-w-44 h-12 px-6 rounded-xl bg-[#cba36f] text-[#0e1431] font-bold flex items-center justify-center gap-2 hover:bg-[#d8b27e] transition-all duration-300 cursor-pointer"
          >
            <FaHome />
            بازگشت به صفحه اصلی
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto min-w-36 h-12 px-6 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2 hover:border-[#cba36f] hover:text-[#cba36f] transition-all duration-300 cursor-pointer"
          >
            <FaArrowRight />
            بازگشت
          </button>

        </div>

        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <div className="w-12 h-px bg-[#cba36f]/30"></div>

          <span className="text-[#cba36f] text-sm font-alibaba">
            سپهر املاک
          </span>

          <div className="w-12 h-px bg-[#cba36f]/30"></div>
        </div>

      </div>
    </div>
  );
}

