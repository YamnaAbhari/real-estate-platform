import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaMapMarkerAlt,
  FaListUl,
  FaImages,
  FaTrash,
} from "react-icons/fa";
import StyledSelect from "../../../Components/StyledSelect";
import useFormFields from "../../../Hooks/useFormFields";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";

const listingTypeOptions = [
  { value: "sale", label: "فروش" },
  { value: "rent", label: "اجاره" },
];

const propertyTypeOptions = [
  { value: "apartment", label: "آپارتمان" },
  { value: "villa", label: "ویلا" },
  { value: "office", label: "اداری" },
  { value: "shop", label: "مغازه" },
  { value: "land", label: "زمین" },
  { value: "warehouse", label: "انبار" },
];

const furnishingOptions = [
  { value: "furnished", label: "مبله" },
  { value: "unfurnished", label: "بدون اثاثیه" },
];

const amenitiesOptions = [
  { label: "آسانسور", value: "elevator" },
  { label: "بالکن", value: "balcony" },
  { label: "انباری", value: "storage" },
  { label: "استخر", value: "pool" },
  { label: "حیاط / باغ", value: "garden" },
  { label: "باشگاه", value: "gym" },
  { label: "نگهبانی", value: "security" },
  { label: "کولر / تهویه", value: "airConditioner" },
  { label: "پارکینگ", value: "parking" },
];

const inputClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-gold focus:ring-1 focus:ring-[#cba36f]";

const labelClass = "mb-1.5 block font-iranYekan text-sm text-gray-600";

export default function AddProperty() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [fields, handleChange, setFields] = useFormFields({
    title: "",
    description: "",
    price: "",
    province: "",
    city: "",
    district: "",
    listingType: "",
    propertyType: "",
    area: "",
    floor: "",
    yearBuilt: "",
    bedrooms: "",
    furnishing: "unfurnished",
    amenities: [],
  });

  const {
    title,
    description,
    price,
    province,
    city,
    district,
    listingType,
    propertyType,
    area,
    floor,
    yearBuilt,
    bedrooms,
    furnishing,
    amenities,
  } = fields;

  const toggleAmenity = (value) => {
    setFields((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value],
    }));
  };

  //========== HANDEL IMAGES ============
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    const withPreview = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages(prev=>[...prev,...withPreview])
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !price ||
      !province ||
      !city ||
      !district ||
      !listingType ||
      !propertyType ||
      !area ||
      !bedrooms ||
      !furnishing ||
      !amenities
    ) {
      notify("error", "لطفاً فیلدهای ضروری را تکمیل کنید");
      return;
    }
    if (!images || images.length === 0) {
      notify("error", "لطفاً حداقل یک تصویر برای ملک انتخاب کنید");
      return;
    }

    setLoading(true);

    try {
      // =========== POST PROPERTY IMAGES ===========
      const formData = new FormData();

      images.forEach((image) => {
        formData.append("files", image.file);
      });

      const imagesRes = await FetchData("uploads/multi", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!imagesRes.success) {
        notify("error", imagesRes.message || "آپلود تصاویر انجام نشد");
        return;
      }

      notify("success", "آپلود تصاویر با موفقیت انجام شد");
       
      // name off uploaded files
      const uploadedImages = imagesRes.data;


           // =========== Remove empty fields ===========
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => {
        if (value === "" || value === null || value === undefined) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );

      // =========== POST PROPERTY INFO ===========
      const res = await FetchData("properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...cleanFields,
          images: uploadedImages,
        }),
      });

      if (!res.success) {
        notify("error", res.message || "ثبت ملک انجام نشد");
        return;
      }

      // =========== SUCCESS ===========
      notify("success", "ملک با موفقیت ثبت شد");



      setFields({
        title: "",
        description: "",
        price: "",
        province: "",
        city: "",
        district: "",
        listingType: "",
        propertyType: "",
        area: "",
        floor: "",
        yearBuilt: "",
        bedrooms: "",
        furnishing: "unfurnished",
        amenities: [],
      });
      setImages([]);
    } catch (error) {
      console.log("CREATE PROPERTY ERROR:", error);

      notify("error", "خطایی در ثبت ملک رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="mx-auto w-full max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-alibaba text-xl font-bold text-dark-blue">
          ثبت ملک جدید
        </h1>
        <p className="mt-1 font-iranYekan text-sm text-gray-500">
          اطلاعات ملک خود را با دقت وارد کنید. پس از ثبت، آگهی برای تأیید ادمین
          ارسال می‌شود.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* اطلاعات پایه */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <FaHome className="text-gold" />
            <h2 className="font-alibaba text-base font-bold text-dark-blue">
              اطلاعات پایه
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>عنوان آگهی</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                placeholder="مثال: آپارتمان ۱۲۰ متری در سعادت‌آباد"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>توضیحات</label>
              <textarea
                name="description"
                value={description}
                onChange={handleChange}
                rows={4}
                placeholder="توضیحات کامل درباره ملک..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-iranYekan text-sm text-dark-blue outline-none transition focus:border-gold focus:ring-1 focus:ring-[#cba36f]"
              />
            </div>

            <div>
              <label className={labelClass}>نوع آگهی</label>
              <StyledSelect
                options={listingTypeOptions}
                name="listingType"
                value={listingType}
                onChange={handleChange}
                noSwiping={false}
                placeholder="انتخاب کنید"
              />
            </div>

            <div>
              <label className={labelClass}>نوع ملک</label>
              <StyledSelect
                options={propertyTypeOptions}
                name="propertyType"
                value={propertyType}
                onChange={handleChange}
                noSwiping={false}
                placeholder="انتخاب کنید"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>قیمت (تومان)</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                placeholder="مثال: 5000000000"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* موقعیت مکانی */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gold" />
            <h2 className="font-alibaba text-base font-bold text-dark-blue">
              موقعیت مکانی
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>استان</label>
              <input
                type="text"
                name="province"
                value={province}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>شهر</label>
              <input
                type="text"
                name="city"
                value={city}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>منطقه / محله</label>
              <input
                type="text"
                name="district"
                value={district}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* مشخصات ملک */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <FaListUl className="text-gold" />
            <h2 className="font-alibaba text-base font-bold text-dark-blue">
              مشخصات ملک
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <label className={labelClass}>متراژ (متر مربع)</label>
              <input
                type="number"
                name="area"
                value={area}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>طبقه</label>
              <input
                type="number"
                placeholder="اختیاری"
                className={inputClass}
                name="floor"
                value={floor}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className={labelClass}>سال ساخت</label>
              <input
                type="number"
                placeholder="اختیاری"
                className={inputClass}
                name="yearBuilt"
                value={yearBuilt}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className={labelClass}>تعداد اتاق خواب</label>
              <input
                type="number"
                name="bedrooms"
                value={bedrooms}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="col-span-2 md:col-span-2">
              <label className={labelClass}>وضعیت اثاثیه</label>
              <StyledSelect
                options={furnishingOptions}
                name="furnishing"
                value={furnishing}
                onChange={handleChange}
                noSwiping={false}
              />
            </div>
          </div>
        </section>

        {/* امکانات */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <FaListUl className="text-gold" />
            <h2 className="font-alibaba text-base font-bold text-dark-blue">
              امکانات
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {amenitiesOptions.map((item) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 font-iranYekan text-sm text-gray-600 transition hover:border-gold"
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(item.value)}
                  onChange={() => toggleAmenity(item.value)}
                  className="h-4 w-4 rounded border-gray-300 text-gold accent-gold focus:ring-[#cba36f]"
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        {/* تصاویر */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <FaImages className="text-gold" />
            <h2 className="font-alibaba text-base font-bold text-dark-blue">
              تصاویر ملک
            </h2>
          </div>

          <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 font-iranYekan text-sm text-gray-500 transition hover:border-gold">
            برای آپلود تصاویر کلیک کنید
            <input
              type="file"
              accept="image/*"
              onChange={handleImagesChange}
              multiple
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <p className="mt-3 font-iranYekan text-xs text-gray-500">
              {images.length} تصویر انتخاب شده
            </p>
          )}

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="group relative h-32 overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={image.url}
                    alt={`تصویر ملک ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-dark-blue cursor-pointer"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-dark-blue px-8 py-3 font-iranYekan text-sm font-medium text-gold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ثبت..." : "ثبت ملک"}
          </button>
        </div>
      </form>
    </div>
  );
}

