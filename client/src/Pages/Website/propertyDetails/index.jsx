import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { Link, useNavigate, useParams } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";

import ImagesSwiper from "./ImagesSwiper";
import { FaMapMarkerAlt } from "react-icons/fa";
import { numberWithCommas } from "../../../Utils/formatPrice";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import PropertyFeatures from "./PropertyFeatures";
import { amenitiesList } from "../../../data/propertyDetails";
import { BsChatDots, BsFillPatchCheckFill } from "react-icons/bs";
import SimilarProperty from "./SimilarProperty";

export default function PropertyDetails() {
  const { user, token } = useSelector((state) => state.auth);

  const [property, setProperty] = useState();
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // =========================
  // Get Property
  // =========================
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const result = await FetchData(`properties/${id}`);

        if (!result.success) {
          notify("error", "خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
          return;
        }

        console.log(result.data);
        setProperty(result.data);
      } catch (err) {
        console.log(err);
        notify("error", "خطا در دریافت ملک");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  //=====================
  // Start Chat
  //=====================
  const handleChat = async () => {
    setChatLoading(true);
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "buyer") {
      notify("error", "فقط خریدار امکان چت با فروشنده را دارد");
      setChatLoading(false);
      return;
    }

    try {
      const result = await FetchData("chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId: id }),
      });

      if (!result.success) {
        notify("error", result.message || "خطا در ایجاد گفت‌وگو");
        return;
      }
      navigate(`/chat/${result.data.chat._id}`);
     
      setChatLoading(false);
    } catch (error) {
      notify("error", "خطا در ایجاد گفت‌وگو");
      setChatLoading(false);
    } finally {
      setChatLoading(false);
    }
  };

  // =========================
  // Add views
  // =========================
  useEffect(() => {
    (async () => {
      try {
        const addView = await FetchData(`properties/${id}/views`, {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!addView.success) {
          console.log("ثبت بازدید انجام نشد");
        }
      } catch (error) {
        console.log("خطا در ثبت بازدید:", error);
      }
    })();
  }, [id, token]);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div
        className="min-h-screen bg-light flex items-center justify-center font-iranYekan"
        dir="rtl"
      >
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // =========================
  // No Property
  // =========================
  if (!property) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-light px-4 sm:px-6 lg:px-10 py-28 font-iranYekan"
      dir="rtl"
    >
      <div className="max-w-8xl mx-auto">
        {/* =========================
            BREADCRUMB
        ========================= */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gold transition-colors">
            خانه
          </Link>

          <IoIosArrowBack />

          <Link to="/properties" className="hover:text-gold transition-colors">
            املاک
          </Link>

          <IoIosArrowBack />

          <span className="text-dark-blue font-medium truncate max-w-62.5">
            {property.title}
          </span>
        </div>

        {/* =========================
            IMAGES + TITLE
        ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* =================================
              RIGHT SIDE - IMAGE GALLERY
          ================================= */}
          <div className="w-full min-w-0">
            <ImagesSwiper propertyId={id} property={property} />
          </div>

          {/* =================================
              LEFT SIDE - TITLE
          ================================= */}
          <div className="flex flex-col justify-center lg:mt-30 sm:px-8 md:px-15 lg:px-0">
            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-dark-blue
                leading-[1.8]
                font-alibaba
              "
            >
              {property.title}
            </h1>
            {/* ================= LOCATION ================= */}
            <div className="flex items-center gap-2 py-2 border-b border-gray-100">
              <FaMapMarkerAlt className="text-gold text-[17px] shrink-0" />

              <div className="flex items-center gap-1.5 text-[18px] font-iranYekan text-gray-600 min-w-0">
                <span className="truncate">{property?.province}</span>

                <span className="text-gold">،</span>

                <span className="truncate">{property?.city}</span>

                <span className="text-gold">،</span>

                <span className="truncate">{property?.district}</span>
              </div>
            </div>
            {/* ================= LISTING PRICE ================= */}{" "}
            <div className="mt-4">
              <div className="bg-dark-blue rounded-2xl px-5 py-4 max-w-70">
                <div className="flex gap-1.5">
                  <RiMoneyDollarCircleLine className="text-2xl text-gold" />

                  <p className="text-sm sm:text-base text-gray-500 font-iranYekan mb-2">
                    قیمت اگهی
                  </p>
                </div>

                <p className="text-gold text-[17px] sm:text-[20px] font-bold font-iranYekan">
                  {numberWithCommas(property?.price)}{" "}
                  <span className="text-[14px]">تومان</span>
                </p>

                <p className="text-sm text-gray-500 font-iranYekan mt-2">
                  {property.listingType == "sale"
                    ? "موجود برای فروش"
                    : "موجود برای اجاره"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== PROPERTY DETAILS ==================== */}
      <div className="w-full grid grid-cols-1  min-[1024px]:grid-cols-[600px_1fr] min-[1056px]:grid-cols-[650px_1fr] min-[1120px]:grid-cols-[700px_1fr]  min-[1210px]:grid-cols-[780px_1fr]  min-[1280px]:grid-cols-[900px_1fr] min-[1420px]:grid-cols-[1050px_1fr]  sm:px-8 md:px-15 lg:px-0">
        <div className="mt-8">
          {/* ================= PROPERTY FEATURES ================= */}
          <PropertyFeatures property={property} />

          {/* ================= PROPERTY DESCRIPTION ================= */}
          <div className="mt-10">
            <h2 className=" text-xl sm:text-2xl font-bold text-dark-blue font-alibaba mb-5 ">
              توضیحات ملک
            </h2>

            <div className=" bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 ">
              <p className=" text-sm sm:text-[13px] lg:text-[14px] text-gray-500 font-iranYekan leading-8 sm:leading-9 text-justify ">
                {property?.description}
              </p>
            </div>
          </div>

          {/* ================= PROPERTY AMENITY ================= */}
          <div className="mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-dark-blue font-alibaba mb-5">
              امکانات ملک
            </h2>

            <div className="">
              <div className="flex flex-wrap gap-x-8 gap-y-5">
                {property?.amenities?.map((amenity) => {
                  const item = amenitiesList.find(
                    (item) => item.value === amenity,
                  );
                  if (!item) return null;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-gray-600 font-iranYekan"
                    >
                      <BsFillPatchCheckFill className="text-gold text-lg shrink-0" />
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =================== CHAT ================= */}
        <div className="w-full lg:pr-6 mt-12 lg:mt-18 animate-floatUpDown">
          <div className="w-full max-w-125 lg:max-w-none mx-auto bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100">
            {/* Seller Profile */}
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              {property?.sellerId?.profilePic ? (
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gold/30 p-0.5">
                  <img
                    src={
                      import.meta.env.VITE_BASE_FILE +
                      property.sellerId.profilePic
                    }
                    alt={property?.sellerId?.name || "فروشنده"}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {property?.sellerId?.name?.charAt(0) || "ف"}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-iranYekan">
                  فروشنده ملک
                </span>

                <span className="text-base font-bold text-dark-blue font-iranYekan">
                  {property?.sellerId?.name || "فروشنده"}
                </span>
              </div>
            </div>

            {/* Chat Content */}
            <div className="py-5">
              <h3 className="text-lg font-bold text-dark-blue font-alibaba mb-2">
                سوالی درباره این ملک دارید؟
              </h3>

              <p className="text-sm text-gray-500 font-iranYekan leading-7">
                می‌توانید برای دریافت اطلاعات بیشتر درباره این ملک، مستقیماً با
                فروشنده در ارتباط باشید.
              </p>
            </div>

            {/* Chat Button */}
            <button
              type="button"
              onClick={handleChat}
              disabled={chatLoading}
              className="w-full bg-dark-blue text-white rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 font-iranYekan font-bold transition-all duration-300 hover:bg-dark-blue/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-dark-blue/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <BsChatDots className="text-xl" />

              {chatLoading ? "در حال ورود به گفتگو..." : "چت با فروشنده"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= PROPERTY INFORMATION ================= */}
      <div className="mt-15">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-blue font-alibaba mb-4">
          اطلاعات ملک
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-xl">
          {/* Property ID */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100">
            <span className="text-xs sm:text-sm text-gray-500 font-iranYekan">
              شناسه ملک
            </span>

            <span className="text-xs sm:text-sm font-semibold text-gold font-iranYekan">
              {property?.propertyCode || property?._id}
            </span>
          </div>

          {/* Added On */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100">
            <span className="text-xs sm:text-sm text-gray-500 font-iranYekan">
              تاریخ ثبت
            </span>

            <span className="text-xs sm:text-sm font-semibold text-gold font-iranYekan">
              {property?.createdAt
                ? new Date(property.createdAt).toLocaleDateString("fa-IR")
                : "-"}
            </span>
          </div>

          {/* Property Type */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100">
            <span className="text-xs sm:text-sm text-gray-500 font-iranYekan">
              نوع ملک
            </span>

            <span className="text-xs sm:text-sm font-semibold text-gold font-iranYekan">
              {property?.propertyType === "apartment"
                ? "آپارتمان"
                : property?.propertyType === "villa"
                  ? "ویلا"
                  : property?.propertyType === "office"
                    ? "دفتر کار"
                    : property?.propertyType === "shop"
                      ? "مغازه"
                      : property?.propertyType === "land"
                        ? "زمین"
                        : property?.propertyType === "warehouse"
                          ? "انبار"
                          : "-"}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3">
            <span className="text-xs sm:text-sm text-gray-500 font-iranYekan">
              وضعیت
            </span>

            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gold font-iranYekan">
              <span className="w-1.5 h-1.5 rounded-full text-gold" />
              {property?.listingType === "sale" ? "فروش" : "اجاره"}
            </span>
          </div>
        </div>
      </div>

      {/* ================== SIMILAR PROPERTY ================= */}
      <div>
        <SimilarProperty />
      </div>
    </div>
  );
}
