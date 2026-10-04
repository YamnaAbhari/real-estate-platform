// export default function SellerApproval() {
//   return (
//     <div>SellerApproval</div>
//   )
// }



import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaSearch,
  FaStore,
} from "react-icons/fa";

import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";

export default function SellerApproval() {
  const { token } = useSelector((state) => state.auth);

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");



  // ================= GET PENDING SELLERS =================

  useEffect(() => {
    if (!token) return;

   (async()=>{
     try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", "1");
      params.set("limit", "20");

    
      const result = await FetchData(
        `users/pending-sellers?&q=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!result.success) {
        notify(
          "error",
          result.message || "دریافت درخواست‌های فروشندگی انجام نشد",
        );
        return;
      }

      setSellers(result.data || []);
    } catch (error) {
      console.log("GET PENDING SELLERS ERROR:", error);

      notify("error", "خطا در دریافت درخواست‌های فروشندگی");
    } finally {
      setLoading(false);
    }
})()
  }, [token, search]);

  // ================= CHANGE SELLER STATUS =================

  const handleSellerStatus = async (userId, sellerStatus) => {
    try {
      setActionLoading(userId);

      const result = await FetchData(
        `users/${userId}/seller-status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sellerStatus,
          }),
        },
      );

      if (!result.success) {
        notify(
          "error",
          result.message || "تغییر وضعیت فروشندگی انجام نشد",
        );
        return;
      }

      notify("success", result.message);

      // چون این صفحه فقط pending ها را نشان می‌دهد،
      // بعد از تایید یا رد، کاربر از لیست حذف می‌شود.
      setSellers((prev) =>
        prev.filter((seller) => seller._id !== userId),
      );
    } catch (error) {
      console.log("CHANGE SELLER STATUS ERROR:", error);

      notify("error", "خطا در تغییر وضعیت فروشندگی");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section dir="rtl" className="w-full sm:px-5 px-3 py-5">
      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold">
            <FaStore />
          </div>

          <div>
            <h2 className="font-alibaba text-xl font-bold text-dark-blue">
              درخواست‌های فروشندگی
            </h2>

            <p className="mt-1 font-iranYekan text-sm text-gray-500">
              درخواست کاربران برای فعال‌سازی حساب فروشندگی را مدیریت کنید
            </p>
          </div>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام یا شماره تلفن..."
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              pr-11
              pl-4
              font-iranYekan
              text-sm
              text-dark-blue
              outline-none
              transition-all
              duration-300
              placeholder:text-gray-400
              focus:border-[#cba36f]
              focus:bg-white
              focus:ring-2
              focus:ring-[#cba36f]/20
            "
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
          <p className="font-iranYekan text-sm text-gray-500">
            در حال دریافت درخواست‌ها...
          </p>
        </div>
      ) : sellers.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FaStore className="text-xl" />
          </div>

          <p className="mt-4 font-alibaba text-base font-bold text-dark-blue">
            درخواست فروشندگی وجود ندارد
          </p>

          <p className="mt-1 font-iranYekan text-sm text-gray-400">
            در حال حاضر هیچ درخواست فروشندگی در انتظار تأیید نیست.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* ================= TABLE HEADER ================= */}

          <div className="hidden grid-cols-[1.5fr_1fr_1.3fr_1fr_1.5fr] items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 lg:grid">
            <p className="font-iranYekan text-xs font-semibold text-gray-500">
              کاربر
            </p>

            <p className="font-iranYekan text-xs font-semibold text-gray-500">
              شماره تماس
            </p>

            <p className="font-iranYekan text-xs font-semibold text-gray-500">
              ایمیل
            </p>

            <p className="font-iranYekan text-xs font-semibold text-gray-500">
              وضعیت
            </p>

            <p className="font-iranYekan text-xs font-semibold text-gray-500">
              عملیات
            </p>
          </div>

          {/* ================= USERS ================= */}

          <div className="divide-y divide-gray-100">
            {sellers.map((seller) => {
              const isLoading = actionLoading === seller._id;

              return (
                <div
                  key={seller._id}
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    px-5
                    py-5
                    transition-colors
                    hover:bg-gray-50/70
                    lg:grid-cols-[1.5fr_1fr_1.3fr_1fr_1.5fr]
                    lg:items-center
                    lg:gap-4
                    lg:px-6
                  "
                >
                  {/* ================= USER ================= */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-dark-blue/10 text-dark-blue">
                      <FaUser />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-alibaba text-sm font-bold text-dark-blue">
                        {seller.name || "بدون نام"}
                      </p>

                      <p className="mt-1 font-iranYekan text-xs text-gray-400">
                        کاربر فروشنده
                      </p>
                    </div>
                  </div>

                  {/* ================= PHONE ================= */}

                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-xs text-gray-400" />

                    <span
                      dir="ltr"
                      className="font-iranYekan text-sm text-gray-600"
                    >
                      {seller.phoneNumber || "-"}
                    </span>
                  </div>

                  {/* ================= EMAIL ================= */}

                  <div className="flex min-w-0 items-center gap-2">
                    <FaEnvelope className="shrink-0 text-xs text-gray-400" />

                    {seller.email ? (
                      <span
                        dir="ltr"
                        className="truncate font-iranYekan text-sm text-gray-600"
                      >
                        {seller.email}
                      </span>
                    ) : (
                      <span className="font-iranYekan text-sm text-gray-400">
                        ایمیل ثبت نشده
                      </span>
                    )}
                  </div>

                  {/* ================= STATUS ================= */}

                  <div>
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 font-iranYekan text-xs font-medium text-orange-600">
                      در انتظار بررسی
                    </span>
                  </div>

                  {/* ================= ACTIONS ================= */}

                  <div className="flex items-center gap-2">
                    {/* APPROVE */}

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handleSellerStatus(
                          seller._id,
                          "approved",
                        )
                      }
                      className="
                        flex
                        h-10
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-50
                        px-3
                        font-iranYekan
                        text-xs
                        font-medium
                        text-emerald-600
                        transition-all
                        hover:bg-emerald-600
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:flex-none
                      "
                    >
                      <FaCheck />

                      <span>
                        {isLoading
                          ? "..."
                          : "تأیید"}
                      </span>
                    </button>

                    {/* REJECT */}

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handleSellerStatus(
                          seller._id,
                          "reject",
                        )
                      }
                      className="
                        flex
                        h-10
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-red-50
                        px-3
                        font-iranYekan
                        text-xs
                        font-medium
                        text-red-600
                        transition-all
                        hover:bg-red-600
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:flex-none
                      "
                    >
                      <FaTimes />

                      <span>
                        رد درخواست
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}