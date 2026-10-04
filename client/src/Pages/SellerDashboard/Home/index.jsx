import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import ReportsSection from "./ReportsSection";
import FetchData from "../../../Utils/FetchData";
import MyListings from "./MyListings";
import { updateUser } from "../../../Store/AuthSlice";

export default function HomeSellerDashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [statistics, setStatistics] = useState(null);
  const [refreshStatistics, setRefreshStatistics] = useState(0);

  // ================= GET CURRENT USER =================
  useEffect(() => {
    if (!token) return;

    const getCurrentUser = async () => {
      try {
        const result = await FetchData("users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.status=='success') {
          dispatch(updateUser(result.data));
        }
      } catch (error) {
        console.log("GET ME ERROR:", error);
      }
    };

    getCurrentUser();

    // بررسی وضعیت کاربر هر 10 ثانیه
    const interval = setInterval(getCurrentUser, 10000);

    return () => clearInterval(interval);
  }, [token, dispatch,user?.sellerStatus]);

  // ================= GET STATISTICS =================
  useEffect(() => {
    if (!token || user?.sellerStatus !== "approved") return;

    const getStatistics = async () => {
      try {
        const result = await FetchData("reports/seller/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.success) {
          setStatistics(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getStatistics();
  }, [token, user?.sellerStatus, refreshStatistics]);

  const handleStatusChange = () => {
    setRefreshStatistics((prev) => prev + 1);
  };

  // ================= PENDING SELLER =================
  if (user?.sellerStatus === "pending") {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f8f8f8] p-6 font-iranYekan"
      >
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <span className="text-3xl">⏳</span>
          </div>

          <h1 className="font-alibaba text-2xl font-bold text-dark-blue">
            حساب فروشندگی شما در حال بررسی است
          </h1>

          <p className="mx-auto mt-4 max-w-lg font-iranYekan text-sm leading-7 text-gray-500">
            درخواست فروشندگی شما برای ادمین ارسال شده و در حال بررسی است.
            پس از تأیید حساب، دسترسی کامل به پنل فروشنده برای شما فعال خواهد شد.
          </p>

          <p className="mt-4 font-iranYekan text-sm text-gray-400">
            معمولاً بررسی درخواست کمتر از ۲۴ ساعت زمان می‌برد.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => (window.location.href = "/properties")}
              className="cursor-pointer rounded-xl bg-dark-blue px-6 py-3 font-iranYekan text-sm text-white transition hover:opacity-90"
            >
              مشاهده املاک
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/contact")}
              className="cursor-pointer rounded-xl border border-gray-200 px-6 py-3 font-iranYekan text-sm text-gray-600 transition hover:bg-gray-50"
            >
              تماس با پشتیبانی
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= REJECT SELLER =================
  if (user?.sellerStatus === "reject") {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f8f8f8] p-6 font-iranYekan"
      >
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-3xl">✕</span>
          </div>

          <h1 className="font-alibaba text-2xl font-bold text-dark-blue">
            درخواست فروشندگی شما تأیید نشد
          </h1>

          <p className="mx-auto mt-4 max-w-lg font-iranYekan text-sm leading-7 text-gray-500">
            متأسفانه درخواست فروشندگی شما توسط مدیریت تأیید نشده است.
            برای دریافت اطلاعات بیشتر می‌توانید با پشتیبانی تماس بگیرید.
          </p>

          <button
            type="button"
            onClick={() => (window.location.href = "/contact")}
            className="mt-7 cursor-pointer rounded-xl bg-dark-blue px-6 py-3 font-iranYekan text-sm text-white transition hover:opacity-90"
          >
            تماس با پشتیبانی
          </button>
        </div>
      </div>
    );
  }

  // ================= APPROVED SELLER =================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f8f8f8]"
    >
      {/* Reports */}
      <motion.div
        dir="rtl"
        className="p-6"
        initial={{ opacity: 0, y: -35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <ReportsSection statistics={statistics} />
      </motion.div>

      {/* My Listings */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <MyListings onStatusChange={handleStatusChange} />
      </motion.div>
    </motion.div>
  );
}