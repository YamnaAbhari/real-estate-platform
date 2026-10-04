import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../Utils/FetchData";
import { useNavigate } from "react-router-dom";
import notify from "../../Utils/Notify";
import {
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaEye,
  FaBuilding,
} from "react-icons/fa";
import { getPropertyFeature, types } from "../../data/property";
import { numberWithCommas } from "../../Utils/formatPrice";

export default function PropertyCard({ property }) {
  const { token, user } = useSelector((state) => state.auth);
  const [isWishlist, setIsWishlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!token) {
        setIsWishlist(false);
        return;
      }
      if (user?.role !== "buyer") {
        return;
      }
      const result = await FetchData(`wishlists/${property._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.success) {
        setIsWishlist(result.data.isWishlist);
      }
    })();
  }, [property._id, token]);

  const handleWishlistToggle = async () => {
    if (!token) {
      navigate("/auth/login");
      return;
    }
    if (user?.role !== "buyer") {
      return;
    }
    const result = await FetchData(`wishlists/${property._id}`, {
      method: isWishlist ? "DELETE" : "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!result.success) {
      notify("error", result.message);
      return;
    }
    setIsWishlist((prev) => !prev);
  };

  const {
    title,
    propertyType,
    province,
    city,
    district,
    bedrooms,
    yearBuilt,
    area,
    views,
    images,
    listingType,
  } = property;

  const getYearBuilt = () => {
    if (yearBuilt) return yearBuilt;

    switch (propertyType) {
      case "land":
        return "ساخته نشده";
      case "office":
        return "—";
      case "shop":
        return "—";
      case "warehouse":
        return "—";
      default:
        return "—";
    }
  };

  const getPropertyType = () => {
    return types[propertyType] || propertyType;
  };

  const formatOfPropertyPrice = numberWithCommas(property?.price);

  const propertyFeature = getPropertyFeature(propertyType, bedrooms);

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* ================= IMAGE ================= */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={import.meta.env.VITE_BASE_FILE + images?.[0]}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Heart */}
        {user?.role == "buyer" && (
          <button
            onClick={() => {
              handleWishlistToggle();
            }}
            type="button"
            className="absolute top-3 left-3 w-10 h-10 rounded-full
                     bg-white/90 backdrop-blur-sm
                     flex items-center justify-center
                     shadow-md cursor-pointer
                     hover:scale-110 transition-all duration-200"
          >
            {isWishlist ? (
              <FaHeart className="text-red-500 text-[19px]" />
            ) : (
              <FaRegHeart className="text-gold text-[19px]" />
            )}
          </button>
        )}

        <span className="absolute top-3 right-3 flex items-center justify-center h-6 w-12 bg-dark-blue rounded-[5px] text-gold text-[12px] font-bold font-alibaba">
          {listingType == "sale" ? "فروش" : "اجاره"}
        </span>

        <span className="absolute bottom-2 left-2 text-gold font-alibaba px-3 py-2 rounded-xl bg-dark-blue font-bold">
          {formatOfPropertyPrice}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5">
        {/* title */}
        <div className="pb-4 border-b border-gray-100">
          <h2 className=" text-dark-blue font-alibaba text-[14px]">{property?.title}</h2>
        </div>
        {/* Property Type + Views */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 pt-2">
          {/* Property Type */}
          <div className="flex items-center gap-2">
            <FaBuilding className="text-gold text-[18px]" />

            <span className="font-alibaba text-sm text-gray-800">
              {getPropertyType()}
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2">
            <FaEye className="text-gold text-[17px]" />

            <span className="font-iranYekan text-sm text-gray-500">
              {views || 0} بازدید
            </span>
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <div className="flex items-center gap-2 py-4 border-b border-gray-100">
          <FaMapMarkerAlt className="text-gold text-[17px] shrink-0" />

          <div className="flex items-center gap-1.5 text-sm font-iranYekan text-gray-600 min-w-0">
            <span className="truncate">{province}</span>

            <span className="text-gold">،</span>

            <span className="truncate">{city}</span>

            <span className="text-gold">،</span>

            <span className="truncate">{district}</span>
          </div>
        </div>

        {/* ================= FEATURES ================= */}
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 py-5">
          {/* Bedrooms */}
          <div className="flex flex-col items-center gap-2 px-2">
            {propertyFeature.icon}

            <span className="font-alibaba text-xs text-gray-500">
              {propertyFeature.title}
            </span>

            <span className="font-iranYekan font-semibold text-sm text-gray-800">
              {propertyFeature.value}
            </span>
          </div>

          {/* Year */}
          <div className="flex flex-col items-center gap-2 px-2">
            <FaCalendarAlt className="text-gold text-[19px]" />

            <span className="font-alibaba text-xs text-gray-500">سال ساخت</span>

            <span className="font-iranYekan font-semibold text-sm text-gray-800">
              {getYearBuilt()}
            </span>
          </div>

          {/* Area */}
          <div className="flex flex-col items-center gap-2 px-2">
            <FaRulerCombined className="text-gold text-[19px]" />

            <span className="font-alibaba text-xs text-gray-500">متراژ</span>

            <span className="font-iranYekan font-semibold text-sm text-gray-800">
              {area ? `${area} متر` : "—"}
            </span>
          </div>
        </div>

        {/* ================= DETAIL BUTTON ================= */}
        <button
          onClick={() =>
            navigate(`/property-details/${property._id}/${property.slug}`)
          }
          type="button"
          className="w-full h-12 rounded-xl
                     bg-gold text-white
                     font-alibaba text-sm
                     flex items-center justify-center gap-2
                     cursor-pointer
                     hover:opacity-90
                     hover:shadow-lg
                     active:scale-[0.98]
                     transition-all duration-200"
        >
          <FaEye className="text-[17px]" />
          مشاهده جزئیات ملک
        </button>
      </div>
    </div>
  );
}
