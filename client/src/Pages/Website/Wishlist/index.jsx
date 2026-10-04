import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import PropertyCard from "../../../Components/PropertyCard";
import { Navigate } from "react-router-dom";


export default function Wishlist() {
  const { token, user } = useSelector((state) => state.auth);

  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const getWishlist = async () => {
      if (!token || user?.role !== "buyer") {
        setLoading(false);
        return;
      }

      try {
        const result = await FetchData("wishlists", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!result.success) {
          notify("error", result.message || "دریافت علاقه‌مندی‌ها با خطا مواجه شد");
          return;
        }

        setWishlists(result.data || []);
      } catch (error) {
        notify(
          "error",
          error.message || "دریافت علاقه‌مندی‌ها با خطا مواجه شد",
        );
      } finally {
        setLoading(false);
      }
    };

    getWishlist();
  }, [token, user?.role]);

    if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f4f4f4] px-5 sm:px-8 md:px-20 lg:px-30 py-30">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="font-alibaba text-xl sm:text-2xl font-bold text-dark-blue">
          علاقه‌مندی‌های من
        </h1>

        <p className="mt-2 font-iranYekan text-sm text-gray-500">
          ملک‌هایی که ذخیره کرده‌اید
        </p>
      </div>

      {/* ================= EMPTY ================= */}
      {wishlists.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <span className="text-4xl text-red-400">♡</span>
          </div>

          <h2 className="font-alibaba text-lg font-bold text-dark-blue">
            هنوز ملکی به علاقه‌مندی‌ها اضافه نکرده‌اید
          </h2>

          <p className="mt-2 font-iranYekan text-sm text-gray-400 text-center">
            ملک‌های مورد علاقه‌تان را ذخیره کنید تا بعداً راحت‌تر به آن‌ها دسترسی
            داشته باشید.
          </p>
        </div>
      ) : (
        <>
          {/* ================= COUNT ================= */}
          <div className="mb-5 flex items-center justify-between">
            <span className="font-iranYekan text-sm text-gray-500">
              {wishlists.length} ملک در علاقه‌مندی‌ها
            </span>
          </div>

          {/* ================= PROPERTY CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {wishlists.map((item) => {
              if (!item.propertyId) return null;

              return (
                <PropertyCard
                  key={item._id}
                  property={item.propertyId}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
