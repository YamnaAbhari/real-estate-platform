import { useEffect, useState } from "react";
import { FaThLarge, FaList, FaChevronDown } from "react-icons/fa";
import useFormFields from "../../../Hooks/useFormFields";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import PropertyCard from "../../../Components/PropertyCard";
import DesktopFilterBox from "./FilterBox/DesktopFilterBox";
import { useNavigate, useParams } from "react-router-dom";
import PropertyCardSkeleton from "../../../Components/PropertyCardSkeleton";
import notFoundIcon from "../../../assets/icons/notFound.png";
import { handleResize } from "../../../Utils/handleResize";
import MobileFilterBox from "./FilterBox/MobileFilterBox";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resize, setResize] = useState(window.innerWidth < 1024);

  const [fields, handleChange, setFields] = useFormFields({
    sort: "-createdAt",
    page: 1,
    search: "",
    minPrice: "",
    maxPrice: "",
    propertyTypes: [],
    bedrooms: "",
    listingType: "all",
    viewMode: "grid",
  });
  const {
    sort,
    page,
    search,
    minPrice,
    maxPrice,
    propertyTypes,
    bedrooms,
    listingType,
    viewMode,
  } = fields;

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 0,
  });

  const { propertyType } = useParams();
  useEffect(() => {
    if (propertyType) {
      setFields((prev) => ({
        ...prev,
        propertyTypes: [propertyType],
      }));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await FetchData(
          `properties?sort=${sort}&limit=25&page=${page}&${listingType=='all'?'':listingType=='sale'?'&listingType=sale':'&listingType=rent'}${propertyTypes.length ? `&propertyType=${propertyTypes.join(",")}` : propertyType ? `&propertyType=${propertyType}` : ""}${
            bedrooms
              ? bedrooms === 5
                ? `&bedrooms[$gte]=5`
                : `&bedrooms=${bedrooms}`
              : ""
          }${minPrice ? `&price[$gte]=${minPrice}` : ""}${
            maxPrice ? `&price[$lte]=${maxPrice}` : ""
          }&q=${search}`,
        );
        if (!result.success) {
          setLoading(false);
          notify("error", 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
          return;
        }

        setProperties(result.data);
        setLoading(false);
      } catch (err) {
        notify("error", "خطا در دریافت املاک");
      } finally {
        setLoading(false);
      }
    })();
  }, [
    sort,
    page,
    search,
    listingType,
    propertyTypes,
    bedrooms,
    minPrice,
    maxPrice,
    propertyType,
  ]);

  //price range
  useEffect(() => {
    const getPriceRange = async () => {
      try {
        const result = await FetchData(
          `properties?${listingType!=='all'?`&listingType=${listingType}`:''}&limit=20`,
        );

        if (!result.success) return;

        const prices = result.data
          .map((property) => property.price)
          .filter((price) => typeof price === "number");

        if (!prices.length) return;

        setPriceRange({
          min: Math.min(...prices),
          max: Math.max(...prices),
        });
      } catch (err) {
        console.log(err);
      }
    };

    getPriceRange();
  }, [listingType]);

  //  remove filters
  const removeFilter = () => {
    setFields({
      ...fields,
      search: "",
      minPrice: "",
      maxPrice: "",
      propertyTypes: [],
      bedrooms: "",
      listingType: "sale",
    });
    navigate("/properties");
  };
  const propertyItems = loading
    ? Array.from({ length: 6 }).map((_, index) => {
        return <PropertyCardSkeleton key={index} />;
      })
    : properties?.map((pro) => {
        return <PropertyCard key={pro._id} property={pro} />;
      });

  // handle resize
  useEffect(() => {
    handleResize(setResize, 1024);
  }, [resize]);
  return (
    <section
      className="min-h-screen bg-light py-8 px-4 sm:px-6 lg:px-10 font-iranYekan"
      dir="rtl"
    >
      <div className="max-w-350 mx-auto mt-20">
        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* =================================================
              SIDEBAR
          ================================================= */}
          {resize ? (
            <MobileFilterBox
              fields={fields}
              handleChange={handleChange}
              setFields={setFields}
              priceRange={priceRange}
              removeFilter={() => removeFilter()}
            />
          ) : (
            <DesktopFilterBox
              fields={fields}
              handleChange={handleChange}
              setFields={setFields}
              priceRange={priceRange}
              removeFilter={() => removeFilter()}
            />
          )}

          {/* =================================================
              CONTENT
          ================================================= */}
          <main className="min-w-0">
            {/* ================= TOP BAR ================= */}
            <div className="bg-white rounded-3xl px-5 sm:px-7 py-5 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                {/* Result */}
                <div>
                  <span className="text-sm text-gray-500">
                    نمایش{" "}
                    <span className="font-bold text-dark-blue">
                      {properties.length}
                    </span>{" "}
                    ملک
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  {/* View Mode */}
                  <div className="flex items-center bg-light rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setFields({ ...fields, viewMode: "grid" })}
                      className={`
                        w-10
                        h-10
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        transition
                        cursor-pointer
                        ${
                          viewMode === "grid"
                            ? "bg-white text-gold shadow-sm"
                            : "text-gray-400 hover:text-dark-blue"
                        }
                      `}
                    >
                      <FaThLarge />
                    </button>

                    <button
                      type="button"
                      onClick={() => setFields({ ...fields, viewMode: "list" })}
                      className={`
                        w-10
                        h-10
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        transition
                        cursor-pointer
                        ${
                          viewMode === "list"
                            ? "bg-white text-gold shadow-sm"
                            : "text-gray-400 hover:text-dark-blue"
                        }
                      `}
                    >
                      <FaList />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:block text-sm text-gray-500">
                      مرتب‌سازی:
                    </span>

                    <div className="relative">
                      <select
                        defaultValue="latest"
                        name="sort"
                        onChange={handleChange}
                        className="
                          appearance-none
                          w-36
                          sm:w-44
                          h-11
                          rounded-xl
                          border border-gray-200
                          bg-white
                          pr-4
                          pl-9
                          text-sm
                          font-semibold
                          text-dark-blue
                          outline-none
                          focus:border-gold
                          cursor-pointer
                        "
                      >
                        <option value="-createdAt">جدیدترین</option>
                        <option value="createdAt">قدیمی‌ترین</option>
                        <option value="-price">گران‌ترین</option>
                        <option value="price">ارزان‌ترین</option>
                      </select>

                      <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= PROPERTY CARDS ================= */}
            {properties == [] ? (
              <div className="min-h-[450px] bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center px-6 text-center">
                <div className="w-32 h-32 mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <img
                    src={notFoundIcon}
                    alt="ملکی یافت نشد"
                    className="w-20 h-20 object-contain opacity-80"
                  />
                </div>

                <h2 className="text-xl font-bold text-dark-blue mb-2">
                  ملکی یافت نشد
                </h2>

                <p className="text-sm text-gray-400 max-w-sm leading-7">
                  متأسفانه ملکی با فیلترهای انتخاب‌شده پیدا نشد.
                  <br />
                  فیلترها را تغییر دهید و دوباره جستجو کنید.
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "grid grid-cols-1 gap-6"
                }
              >
                {/* =================== PROPERTY CARD ======================= */}

                {propertyItems}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
