import {
  FaBath,
  FaBed,
  FaBuilding,
  FaCalendarAlt,
  FaCouch,
  FaHome,
  FaRulerCombined,
} from "react-icons/fa";
import { types } from "../../../../data/property";

export default function PropertyFeatures({ property }) {
  return (
    <div className="flex flex-col  mt-8">
      <h2 className="text-xl sm:text-2xl font-bold text-dark-blue font-alibaba mb-5">
        مشخصات ملک
      </h2>

      <div className=" grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Property Type */}
        {property?.propertyType && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2  transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FaHome className="text-gold text-lg" />
            </div>

            <span className="text-sm text-gray-500 font-iranYekan">
              نوع ملک
            </span>

            <span className="text-base font-bold text-gold font-iranYekan">
             {types[property?.propertyType]}
            </span>
          </div>
        )}

        {/* Area */}
        {property?.area > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FaRulerCombined className="text-gold text-lg" />
            </div>

            <span className="text-sm text-gray-500 font-iranYekan">متراژ</span>

            <span className="text-base font-bold text-gold font-iranYekan">
              {property.area.toLocaleString("fa-IR")} متر
            </span>
          </div>
        )}

        {/* Floor */}
        {property?.floor !== null && property?.floor !== 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FaBuilding className="text-gold text-lg" />
            </div>

            <span className="text-sm text-gray-500 font-iranYekan">طبقه</span>

            <span className="text-base font-bold text-gold font-iranYekan">
              {property.floor}
            </span>
          </div>
        )}

        {/* Year Built */}

        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
            <FaCalendarAlt className="text-gold text-lg" />
          </div>

          <span className="text-sm text-gray-500 font-iranYekan">سال ساخت</span>

          <span className="text-base font-bold text-gold font-iranYekan">
            {property?.propertyType == "land"
              ? "ساخته نشده"
              : property.yearBuilt}
          </span>
        </div>

        {/* Bedrooms */}
        {property?.bedrooms > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FaBed className="text-gold text-lg" />
            </div>

            <span className="text-sm text-gray-500 font-iranYekan">
              اتاق خواب
            </span>

            <span className="text-base font-bold text-gold font-iranYekan">
              {property.bedrooms}
            </span>
          </div>
        )}

        {/* Bathrooms */}
        {property?.bathrooms > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FaBath className="text-gold text-lg" />
            </div>

            <span className="text-sm text-gray-500 font-iranYekan">حمام</span>

            <span className="text-base font-bold text-gold font-iranYekan">
              {property.bathrooms}
            </span>
          </div>
        )}

        {/* Furnishing */}
        {property?.furnishing && (
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-2 transition-all  duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
              <FaCouch className="text-gold text-lg" />
            </div>

            <span className="text-sm text-gray-500 font-iranYekan">
              وضعیت مبلمان
            </span>

            <span className="text-base font-bold text-gold font-iranYekan">
              {property.furnishing === "furnished" ? "مبله" : "غیرمبله"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
