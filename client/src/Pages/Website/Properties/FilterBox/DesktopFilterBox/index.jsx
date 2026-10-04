import { FaFilter, FaSearch } from "react-icons/fa";
import { bedroomsCount, propertyType } from "../../../../../data/property";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { numberWithCommas } from "../../../../../Utils/formatPrice";
import { useNavigate } from "react-router-dom";

export default function DesktopFilterBox({
  fields,
  handleChange,
  setFields,
  priceRange,
  removeFilter
}) {
  const { minPrice, maxPrice, propertyTypes, listingType } = fields;
  const navigate=useNavigate()

  return (
    <aside className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gold text-lg" />

          <h2 className="font-alibaba text-lg font-bold text-dark-blue">
            فیلترها
          </h2>
        </div>

        <button type="button" className="filter-clear-button" onClick={()=>removeFilter()}>
          پاک کردن
        </button>
      </div>

      {/* ================= LOCATION ================= */}

      <div className="mb-8">
        <h3 className="filter-section-title">موقعیت</h3>

        <div className="relative">
          <FaSearch
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-400
              text-sm
            "
          />

          <input
            type="text"
            placeholder="جستجو بر اساس شهر..."
            name="search"
            onChange={handleChange}
            className="filter-input"
          />
        </div>
      </div>

      {/* ================= LISTING TYPE ================= */}

      <div className="mb-8">
        <h3 className="filter-section-title">نوع معامله</h3>

        <div className="flex items-center justify-center gap-2">
          {/* فروش */}

          <button
            type="button"
            onClick={() =>
              setFields({
                ...fields,
                listingType: "sale",
              })
            }
            className={`filter-option-button ${
              listingType === "sale" ? "active" : ""
            }`}
          >
            فروش
          </button>

          {/* اجاره */}

          <button
            type="button"
            onClick={() =>
              setFields({
                ...fields,
                listingType: "rent",
              })
            }
            className={`filter-option-button ${
              listingType === "rent" ? "active" : ""
            }`}
          >
            اجاره
          </button>
        </div>
      </div>

      {/* ================= PRICE ================= */}

      <div className="mb-8">
        <div className="flex flex-col  justify-between mb-5">
          <h3 className="filter-section-title !mb-0">محدوده قیمت</h3>

          <div className="flex flex-col w-full items-center justify-center gap-2 mt-3">
            <input
              type="text"
              name="minPrice"
              value={numberWithCommas(minPrice || priceRange.min)}
              onChange={handleChange}
              className="filter-input"
            />

            <input
              type="text"
              name="maxPrice"
              value={numberWithCommas(maxPrice || priceRange.max)}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
        </div>

        <div>
          <Slider
            range
            min={priceRange.min}
            max={priceRange.max}
            step={10000000}
            value={[
              Number(minPrice) || priceRange.min,
              Number(maxPrice) || priceRange.max,
            ]}
            onChange={(values) => {
              setFields({
                ...fields,
                minPrice: values[0],
                maxPrice: values[1],
              });
            }}
            styles={{
              track: {
                backgroundColor: "#cba36f",
              },
              rail: {
                backgroundColor: "#e5e7eb",
              },
              handle: {
                backgroundColor: "#cba36dsf",
                borderColor: "#cba36f",
                opacity: 1,
              },
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">گران ترین</span>

          <span className="text-xs text-gray-400">ارزان ترین</span>
        </div>
      </div>

      {/* ================= PROPERTY TYPE ================= */}

      <div className="mb-8">
        <h3 className="filter-section-title">نوع ملک</h3>

        <div className="space-y-3">
          {propertyType.map((type) => {
            const isChecked = propertyTypes?.includes(type.value);

            return (
              <label
                key={type.value}
                className="filter-option-wrapper flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setFields({
                      ...fields,
                      propertyTypes: isChecked
                        ? fields.propertyTypes.filter(
                            (item) => item !== type.value,
                          )
                        : [...fields.propertyTypes, type.value],
                    });
                    navigate(`/properties/${type.value}`)
                  }}
                  className="filter-checkbox"
                />

                <span className="filter-option-label">{type.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ================= BEDROOM ================= */}

      <div>
        <h3 className="filter-section-title">تعداد اتاق خواب</h3>

        <div className="grid grid-cols-4 gap-2">
  {bedroomsCount.map((bedroom, index) => (
    <button
      key={bedroom.label}
      type="button"
      onClick={() =>
        setFields({
          ...fields,
          bedrooms: bedroom.value,
        })
      }
      className={`h-11 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gold hover:text-gold transition cursor-pointer ${
        index === bedroomsCount.length - 1 ? "col-span-4" : ""
      }`}
    >
      {bedroom.label}
    </button>
  ))}
</div>

      
      </div>
    </aside>
  );
}
