import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

import DashboardPropertyCard from "../../../Components/DashboardPropertyCard";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import useFormFields from "../../../Hooks/useFormFields";

const propertyTypeMap = {
  آپارتمان: "apartment",
  اپارتمان: "apartment",
  ویلا: "villa",
  دفتر: "office",
  مغازه: "shop",
  زمین: "land",
  انبار: "warehouse",
};

export default function MyListings({ onStatusChange }) {
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPropertyDelete, setIsPropertyDelete] = useState(0);

  const [fields, handleChange, setFields] = useFormFields({
    title: "",
    location: "",
    propertyType: "",
    listingType: "",
  });

  const { title, location, propertyType, listingType } = fields;

  // ================= GET MY PROPERTIES =================

  useEffect(() => {
    const getProperties = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.set("sort", "-createdAt");

        if (title.trim()) {
          params.set("title", title.trim());
        }

        if (location.trim()) {
          params.set("location", location.trim());
        }

        if (propertyType.trim()) {
          const propertyTypeValue =
            propertyTypeMap[propertyType.trim()] || propertyType.trim();

          params.set("propertyType", propertyTypeValue);
        }

        if (listingType) {
          params.set("listingType", listingType);
        }

        const result = await FetchData(
          `properties/seller/my-properties?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!result.success) {
          notify("error", result.message || "خطایی رخ داده است");
          return;
        }

        setProperties(result.data);
      } catch (err) {
        console.log("ERROR:", err);
        notify("error", "خطا در دریافت املاک");
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, [
    isPropertyDelete,
    token,
    title,
    location,
    propertyType,
    listingType,
  ]);

  // ================= ANIMATION =================

  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardsContainerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.97,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      dir="rtl"
      className="bg-[#f8f8f8] p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ================= HEADER ================= */}

      <motion.div
        variants={itemVariants}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="font-alibaba text-xl font-bold text-dark-blue">
            املاک من
          </h2>

          <p className="mt-1 font-iranYekan text-sm text-gray-500">
            مدیریت و مشاهده تمامی آگهی‌های شما
          </p>
        </div>

        {/* Add Property */}

        <motion.button
          type="button"
          onClick={() => navigate("/seller-dashboard/add-property")}
          whileHover={{
            y: -3,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.97,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
          className="
            flex
            h-11
            items-center
            gap-2
            rounded-xl
            bg-dark-blue
            px-5
            font-iranYekan
            text-sm
            font-medium
            text-gold
            shadow-sm
            cursor-pointer
          "
        >
          <FaPlus className="text-sm" />
          افزودن ملک
        </motion.button>
      </motion.div>

      {/* ================= SEARCH BOXES ================= */}

      <motion.div
        variants={itemVariants}
        className="
          mb-6
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
        "
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {/* Search Title */}

          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative"
          >
            <FaSearch
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="جستجو بر اساس عنوان ملک..."
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
          </motion.div>

          {/* Search Location */}

          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative"
          >
            <FaMapMarkerAlt
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              placeholder="جستجو بر اساس شهر یا محله..."
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
          </motion.div>

          {/* Search Property Type */}

          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative"
          >
            <FaSearch
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              name="propertyType"
              value={propertyType}
              onChange={handleChange}
              placeholder="جستجو بر اساس نوع ملک..."
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
          </motion.div>

          {/* Search Listing Type */}

          <motion.div
            variants={itemVariants}
            className="
              flex
              h-12
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              font-iranYekan
            "
          >
            <button
              type="button"
              onClick={() =>
                setFields((prev) => ({
                  ...prev,
                  listingType: "sale",
                }))
              }
              className={`
                flex-1
                text-sm
                transition-all
                duration-300
                cursor-pointer
                ${
                  listingType === "sale"
                    ? "bg-dark-blue font-medium text-gold"
                    : "text-gray-500 hover:bg-gray-100"
                }
              `}
            >
              فروش
            </button>

            <button
              type="button"
              onClick={() =>
                setFields((prev) => ({
                  ...prev,
                  listingType: "rent",
                }))
              }
              className={`
                flex-1
                text-sm
                transition-all
                duration-300
                cursor-pointer
                ${
                  listingType === "rent"
                    ? "bg-dark-blue font-medium text-gold"
                    : "text-gray-500 hover:bg-gray-100"
                }
              `}
            >
              اجاره
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ================= PROPERTIES ================= */}

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <p className="font-iranYekan text-sm text-gray-500">
            در حال دریافت املاک...
          </p>
        </motion.div>
      ) : properties.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="rounded-2xl bg-white py-16 text-center shadow-sm"
        >
          <p className="font-iranYekan text-sm text-gray-500">
            هنوز ملکی ثبت نکرده‌اید.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {properties.map((property) => (
            <motion.div
              key={property._id}
              variants={cardVariants}
              layout
              whileHover={{
                y: -5,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <DashboardPropertyCard
                property={property}
                onStatusChange={onStatusChange}
                setIsPropertyDelete={setIsPropertyDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}