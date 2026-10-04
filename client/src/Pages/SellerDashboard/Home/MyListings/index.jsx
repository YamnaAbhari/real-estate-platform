import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import FetchData from "../../../../Utils/FetchData";
import notify from "../../../../Utils/Notify";
import PropertyCardSkeleton from "../../../../Components/PropertyCardSkeleton";
import DashboardPropertyCard from "../../../../Components/DashboardPropertyCard";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function MyListings({onStatusChange}) {
  const { token } = useSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const swiperRef = useRef(null);
  const navigate=useNavigate()
  const [isPropertyDelete,setIsPropertyDelete]=useState(0)



  //============== GET MY PROPERTIES ===============
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await FetchData(
          "properties/seller/my-properties?sort=-createdAt&limit=5",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!result.success) {
          setLoading(false);
          notify("error", "خطایی رخ داده است. لطفاً دوباره تلاش کنید.");
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
  }, [isPropertyDelete]);

  const propertyItems = loading
    ? Array.from({ length: 6 }).map((_, index) => (
        <SwiperSlide
          key={`skeleton-${index}`}
          className="!w-[350px] max-[700px]:!w-[350px] max-[400px]:!w-[300px]"
        >
          <PropertyCardSkeleton />
        </SwiperSlide>
      ))
    : properties.map((pro) => (
        <SwiperSlide
          key={pro._id}
          className="!w-[350px] max-[700px]:!w-[350px] max-[400px]:!w-[300px]"
        >
          <DashboardPropertyCard property={pro} onStatusChange={onStatusChange} isPropertyDelete={isPropertyDelete} setIsPropertyDelete={setIsPropertyDelete}/>
        </SwiperSlide>
      ));

  return (
    <div className="w-full bg-light py-12 my-20">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="text-right">
            <h2 className="font-alibaba text-2xl md:text-3xl font-bold text-gold mt-2">
             املاک من
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


       {/* button for see all the property */}
       <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => navigate("/seller-dashboard/my-listings")}
            className="
              h-12
              px-8
              rounded-xl
              bg-dark-blue
              text-gold
              font-alibaba
              text-sm
              flex
              items-center
              gap-2
              cursor-pointer
              hover:bg-[#171d3d]
              hover:scale-105
              transition-all
              shadow-md
            "
          >
            مشاهده همه املاک
            <BsChevronLeft className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
