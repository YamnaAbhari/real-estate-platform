import { useState } from "react";
import { useSelector } from "react-redux";
import FetchData from "../../Utils/FetchData";
import { useNavigate } from "react-router-dom";
import notify from "../../Utils/Notify";
import {
  FaCalendarAlt,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaEye,
  FaBuilding,
  FaTrash,
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";
import { getPropertyFeature, types } from "../../data/property";
import { numberWithCommas } from "../../Utils/formatPrice";
import StyledSelect from "../StyledSelect";

export default function DashboardPropertyCard({
  property,
  onStatusChange,
  setIsPropertyDelete,
}) {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [propertyStatus, setPropertyStatus] = useState(property.status);

  const options = [
    { value: "available", label: "فعال" },
    { value: "sold", label: "فروخته شده" },
    { value: "rented", label: "اجاره داده شده" },
  ];

  const handleStatusChange = async (newStatus) => {
    setPropertyStatus(newStatus);

    try {
      const result = await FetchData(`properties/${property._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!result.success) {
        setPropertyStatus(property.status);
        notify(
          "error",
          result.message || "تغییر وضعیت ملک با خطا مواجه شد",
        );
        return;
      }

      notify("success", "وضعیت ملک با موفقیت تغییر کرد");
      onStatusChange?.();
    } catch (error) {
      setPropertyStatus(property.status);
      notify("error", "خطا در تغییر وضعیت ملک");
      console.log(error);
    }
  };

  // =============== Delete property ===============
  const handleDeleteProperty = async () => {
    try {
      const res = await FetchData(`properties/${property?._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.success) {
        notify("error", res.message || "خطایی رخ داده است");
        return;
      }

      notify("success", res.message);
      setIsPropertyDelete((prev) => prev + 1);
    } catch (error) {
      notify("error", "خطایی رخ داده است");
    }
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
      case "shop":
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

  // اطلاعات فروشنده
  const seller = property?.sellerId;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      {/* ================= IMAGE ================= */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={import.meta.env.VITE_BASE_FILE + images?.[0]}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        <span className="absolute right-3 top-3 flex h-6 w-12 items-center justify-center rounded-[5px] bg-dark-blue text-[12px] font-bold text-gold font-alibaba">
          {listingType === "sale" ? "فروش" : "اجاره"}
        </span>

        <span className="absolute bottom-2 left-2 rounded-xl bg-dark-blue px-3 py-2 font-alibaba font-bold text-gold">
          {formatOfPropertyPrice}
        </span>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5">
        {/* Title */}
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-alibaba text-[14px] text-dark-blue">
            {property?.title}
          </h2>
        </div>

        {/* Property Type + Views */}
        <div className="mt-3 flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <FaBuilding className="text-[18px] text-gold" />

            <span className="font-alibaba text-sm text-gray-800">
              {getPropertyType()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaEye className="text-[17px] text-gold" />

            <span className="font-iranYekan text-sm text-gray-500">
              {views || 0} بازدید
            </span>
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <div className="flex items-center gap-2 border-b border-gray-100 py-4">
          <FaMapMarkerAlt className="shrink-0 text-[17px] text-gold" />

          <div className="flex min-w-0 items-center gap-1.5 font-iranYekan text-sm text-gray-600">
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

            <span className="font-iranYekan text-sm font-semibold text-gray-800">
              {propertyFeature.value}
            </span>
          </div>

          {/* Year */}
          <div className="flex flex-col items-center gap-2 px-2">
            <FaCalendarAlt className="text-[19px] text-gold" />

            <span className="font-alibaba text-xs text-gray-500">
              سال ساخت
            </span>

            <span className="font-iranYekan text-sm font-semibold text-gray-800">
              {getYearBuilt()}
            </span>
          </div>

          {/* Area */}
          <div className="flex flex-col items-center gap-2 px-2">
            <FaRulerCombined className="text-[19px] text-gold" />

            <span className="font-alibaba text-xs text-gray-500">
              متراژ
            </span>

            <span className="font-iranYekan text-sm font-semibold text-gray-800">
              {area ? `${area} متر` : "—"}
            </span>
          </div>
        </div>

        {/* ================= PROPERTY ACTIONS ================= */}
        <div className="flex items-center gap-2 pt-2">
          {user?.role === "admin" ? (
            <>
              {/* Seller Information */}
              <div className="flex min-h-10 flex-1 items-center gap-3 rounded-xl bg-gray-50 px-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark-blue/10">
                  <FaUser className="text-sm text-dark-blue" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-alibaba text-xs font-semibold text-dark-blue">
                    {seller?.name || "نامشخص"}
                  </p>

                  <div
                    dir="ltr"
                    className="mt-0.5 flex items-center gap-1 text-left font-iranYekan text-[11px] text-gray-500"
                  >
                    <FaPhoneAlt className="text-[9px] text-gold" />
                    <span>{seller?.phoneNumber || "شماره ثبت نشده"}</span>
                  </div>
                </div>
              </div>

              {/* Property Detail */}
              <button
                type="button"
                onClick={() => {
                  navigate(`/property-details/${property._id}/${property.slug}`);
                }}
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl text-dark-blue
                  cursor-pointer
                  transition-all
                  hover:bg-dark-blue
                  hover:text-gold
                  hover:scale-105
                "
                title="مشاهده جزئیات ملک"
              >
                <FaArrowLeft className="text-[18px]" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl text-red-500
                  cursor-pointer
                  transition-all
                  hover:bg-red-100
                  hover:scale-105
                "
                title="حذف ملک"
              >
                <FaTrash className="text-[18px]" />
              </button>
            </>
          ) : (
            <>
              {/* Select box for seller */}
              <StyledSelect
                options={options}
                value={propertyStatus}
                onChange={handleStatusChange}
              />

              {/* Edit */}
              <button
                type="button"
                onClick={() => {
                  navigate(
                    `/seller-dashboard/edit-property/${property._id}`,
                  );
                }}
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl text-gold
                  cursor-pointer
                  transition-all
                  hover:bg-[#171d3d]
                  hover:scale-105
                "
                title="ویرایش ملک"
              >
                <FaEdit className="text-[18px]" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDeleteProperty}
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-xl text-red-500
                  cursor-pointer
                  transition-all
                  hover:bg-red-100
                  hover:scale-105
                "
                title="حذف ملک"
              >
                <FaTrash className="text-[18px]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}