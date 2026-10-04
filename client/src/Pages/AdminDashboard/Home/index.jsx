import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import ReportsSection from "./ReportsSection";
import { FaCloud, FaCog, FaDatabase, FaFileAlt, FaSave, FaServer, FaShieldAlt, FaTools } from "react-icons/fa";



export default function HomeAdminDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDashboardStatistics = async () => {
      try {
        setLoading(true);

        const result = await FetchData("reports/admin/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!result.success) {
          notify(
            "error",
            result.message || "دریافت آمار داشبورد انجام نشد",
          );
          return;
        }

        setStatistics(result.data);
      } catch (error) {
        console.log("DASHBOARD STATISTICS ERROR:", error);

        notify("error", "خطا در دریافت آمار داشبورد");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getDashboardStatistics();
    }
  }, [token]);

  if (loading && !statistics) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[300px] items-center justify-center"
      >
        <p className="font-iranYekan text-sm text-gray-500">
          در حال دریافت اطلاعات داشبورد...
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8f8f8] p-6"
    >
      <ReportsSection statistics={statistics} />


      {/* ================= SYSTEM HEALTH ================= */}
      <div className="mt-15 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 ">
        {/* System Health */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-alibaba text-lg font-bold text-dark-blue">
              وضعیت سیستم
            </h2>

            <p className="mt-1 font-iranYekan text-xs text-gray-500">
              وضعیت سرویس‌ها و بخش‌های اصلی سامانه
            </p>
          </div>

          <div className="space-y-3">
            {/* Database */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FaDatabase />
                </div>

                <div>
                  <p className="font-iranYekan text-sm font-medium text-dark-blue">
                    پایگاه داده
                  </p>
                  <p className="font-iranYekan text-xs text-gray-400">
                    Database
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>

            {/* Media Storage */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <FaCloud />
                </div>

                <div>
                  <p className="font-iranYekan text-sm font-medium text-dark-blue">
                    فضای ذخیره‌سازی
                  </p>
                  <p className="font-iranYekan text-xs text-gray-400">
                    Media Storage
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>

            {/* System Logs */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <FaFileAlt />
                </div>

                <div>
                  <p className="font-iranYekan text-sm font-medium text-dark-blue">
                    گزارش‌های سیستم
                  </p>
                  <p className="font-iranYekan text-xs text-gray-400">
                    System Logs
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>

            {/* Auth Service */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FaShieldAlt />
                </div>

                <div>
                  <p className="font-iranYekan text-sm font-medium text-dark-blue">
                    سرویس احراز هویت
                  </p>
                  <p className="font-iranYekan text-xs text-gray-400">
                    Auth Service
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>

            {/* DB Backup */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <FaSave />
                </div>

                <div>
                  <p className="font-iranYekan text-sm font-medium text-dark-blue">
                    پشتیبان پایگاه داده
                  </p>
                  <p className="font-iranYekan text-xs text-gray-400">
                    DB Backup
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>

            {/* API Gateway */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FaServer />
                </div>

                <div>
                  <p className="font-iranYekan text-sm font-medium text-dark-blue">
                    درگاه API
                  </p>
                  <p className="font-iranYekan text-xs text-gray-400">
                    API Gateway
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                آنلاین
              </span>
            </div>
          </div>
        </div>

        {/* ================= ADMIN TOOLS ================= */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-alibaba text-lg font-bold text-dark-blue">
              ابزارهای مدیریتی
            </h2>

            <p className="mt-1 font-iranYekan text-xs text-gray-500">
              مدیریت سریع منابع و وظایف سامانه
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* System Logs */}
            <button
              type="button"
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-105">
                <FaFileAlt className="text-lg" />
              </div>

              <div>
                <p className="font-alibaba text-sm font-bold text-dark-blue">
                  گزارش‌های سیستم
                </p>
                <p className="mt-1 font-iranYekan text-xs text-gray-400">
                  مشاهده فعالیت‌های سیستم
                </p>
              </div>
            </button>

            {/* DB Backup */}
            <button
              type="button"
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold transition-transform duration-300 group-hover:scale-105">
                <FaSave className="text-lg" />
              </div>

              <div>
                <p className="font-alibaba text-sm font-bold text-dark-blue">
                  پشتیبان‌گیری
                </p>
                <p className="mt-1 font-iranYekan text-xs text-gray-400">
                  مدیریت نسخه پشتیبان
                </p>
              </div>
            </button>

            {/* Settings */}
            <button
              type="button"
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-105">
                <FaCog className="text-lg" />
              </div>

              <div>
                <p className="font-alibaba text-sm font-bold text-dark-blue">
                  تنظیمات
                </p>
                <p className="mt-1 font-iranYekan text-xs text-gray-400">
                  تنظیمات سامانه
                </p>
              </div>
            </button>

            {/* Admin Tools */}
            <button
              type="button"
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-right transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform duration-300 group-hover:scale-105">
                <FaTools className="text-lg" />
              </div>

              <div>
                <p className="font-alibaba text-sm font-bold text-dark-blue">
                  ابزارهای مدیریت
                </p>
                <p className="mt-1 font-iranYekan text-xs text-gray-400">
                  مدیریت منابع سامانه
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
