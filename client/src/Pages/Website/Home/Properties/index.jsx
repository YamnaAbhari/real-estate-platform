import { useEffect, useRef, useState } from "react";
import FetchData from "../../../../Utils/FetchData";
import notify from "../../../../Utils/Notify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PropertyCard from "../../../../Components/PropertyCard";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import PropertyCardSkeleton from "../../../../Components/PropertyCardSkeleton";
import { motion } from "framer-motion";


export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await FetchData("properties?sort=-createdAt&limit=6");
        if (!result.success) {
          setLoading(false);
          notify("error", 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
          return;
        }

        setProperties(result.data);
        setLoading(false);
      } catch (err) {
        console.log("ERROR:", err);
        notify("error", "خطا در دریافت املاک");
      } finally {
        setLoading(false);
      }
    })();
  }, []);



const propertyItems = loading
  ? Array.from({ length: 6 }).map((_, index) => (
      <SwiperSlide
        key={`skeleton-${index}`}
        className="!w-[400px] max-[700px]:!w-[350px] max-[400px]:!w-[300px]"
      >
        <PropertyCardSkeleton />
      </SwiperSlide>
    ))
  : properties.map((pro) => (
      <SwiperSlide
        key={pro._id}
        className="!w-[400px] max-[700px]:!w-[350px] max-[400px]:!w-[300px]"
      >
        <PropertyCard property={pro} />
      </SwiperSlide>
    ));

return (


<div className="w-full bg-light py-16">
  <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">

    {/* Header */}
    <div className="flex items-end justify-between mb-8">

      <div className="text-right">
        <span className="font-alibaba text-gold text-sm">
          پیشنهادهای ویژه
        </span>

        <h2 className="font-alibaba text-2xl md:text-3xl font-bold text-dark-blue mt-2">
          جدیدترین املاک
        </h2>

        <p className="font-iranYekan text-sm text-gray-500 mt-2">
          جدیدترین ملک‌های ثبت‌شده را مشاهده کنید
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">

        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="prev-next"
        >
          <BsChevronRight className="text-lg" />
        </button>

        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="prev-next"
        >
          <BsChevronLeft className="text-lg" />
        </button>

      </div>

    </div>

    {/* Slider */}
     <motion.div
       initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: 0.7,
    ease: "easeOut",
  }}
    >
      <div className="relative">
      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {propertyItems}
      </Swiper>

    </div>
    </motion.div>
    

  </div>
</div>
)}
