import { useEffect, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import DesktopFilterBox from "../DesktopFilterBox";

export default function MobileFilterBox({
  fields,
  handleChange,
  setFields,
  priceRange,
  removeFilter,
}) {
  const [isOpen, setIsOpen] = useState(false);

   useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isOpen]);

  return (
    <>
      {/* ================= BUTTON ================= */}

      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <div className="flex  items-center">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center ">
            <FaFilter className="text-gold text-xl" />
          </div>

          <h2 className="text-[16px] font-bold text-dark-blue opacity-80">
            نشان دادن فیلتر و جستجو
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className=" px-6 py-3 rounded-xl bg-gold text-white text-sm font-bold hover:opacity-90 transition cursor-pointer mb-2"
        >
          نمایش فیلترها
        </button>
      </div>

      {/* ================= OVERLAY ================= */}

      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-50 bg-black/30 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed top-0 right-0 z-50
          h-screen
          w-[85%] sm:w-100
          bg-white
          shadow-2xl
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Sidebar Header */}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-blue">فیلترها</h2>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-xl bg-light flex items-center justify-center text-gray-500 hover:text-gold transition cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Filter */}

        <div className="p-4">
          <DesktopFilterBox
            fields={fields}
            handleChange={handleChange}
            setFields={setFields}
            priceRange={priceRange}
            removeFilter={removeFilter}
          />
        </div>
      </aside>
    </>
  );
}
