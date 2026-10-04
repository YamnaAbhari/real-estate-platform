import { useEffect, useRef, useState } from "react";

import FetchData from "../../../../Utils/FetchData";
import { useParams } from "react-router-dom";
import notify from "../../../../Utils/Notify";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import PropertyCardSkeleton from "../../../../Components/PropertyCardSkeleton";
import PropertyCard from "../../../../Components/PropertyCard";

import { motion } from "framer-motion";
import {
  BsChevronLeft,
  BsChevronRight,
  BsBuilding,
} from "react-icons/bs";

export default function SimilarProperty() {
  const [similarProperty, setSimilarProperty] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const swiperRef = useRef(null);

  useEffect(() => {
    const getSimilarProperties = async () => {
      setLoading(true);

      try {
        const result = await FetchData(`properties/${id}/similar`);

        if (!result.success) {
          notify(
            "error",
            "مشکلی به وجود آمد، لطفاً دوباره تلاش کنید"
          );
          return;
        }

        setSimilarProperty(result.data || []);
      } catch (error) {
        notify(
          "error",
          "مشکلی به وجود آمد، لطفاً دوباره تلاش کنید"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getSimilarProperties();
    }
  }, [id]);

  return (
    <div className="w-full bg-light py-16">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-3">

        {/* ================= TITLE ================= */}
        <div className="mb-7 sm:mb-9">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-blue font-alibaba">
            املاک مشابه
          </h2>

          <div className="mt-2 w-12 h-1 bg-gold rounded-full" />
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <Swiper
              spaceBetween={20}
              slidesPerView="auto"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <SwiperSlide
                  key={`skeleton-${index}`}
                  className="
                    !w-[340px]
                    max-[700px]:!w-[350px]
                    max-[400px]:!w-[300px]
                  "
                >
                  <PropertyCardSkeleton />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : similarProperty.length > 0 ? (
          /* ================= SIMILAR PROPERTIES ================= */
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
                {similarProperty.map((pro) => (
                  <SwiperSlide
                    key={pro._id}
                    className="
                      !w-[340px]
                      max-[700px]:!w-[350px]
                      max-[400px]:!w-[300px]
                    "
                  >
                    <PropertyCard property={pro} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ================= NAVIGATION ================= */}
            {similarProperty.length >1 && (
              <div className="flex items-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="prev-next"
                  aria-label="ملک قبلی"
                >
                  <BsChevronRight className="text-lg" />
                </button>

                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="prev-next"
                  aria-label="ملک بعدی"
                >
                  <BsChevronLeft className="text-lg" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              w-full
              min-h-[190px]
              bg-white
              rounded-2xl
              border
              border-gray-100
              shadow-sm
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-5
              py-10
            "
          >
            <div
              className="
                w-14
                h-14
                rounded-full
                bg-gold/10
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <BsBuilding className="text-gold text-2xl" />
            </div>

            <h3 className="font-alibaba text-base sm:text-lg font-bold text-dark-blue">
              ملک مشابهی پیدا نشد
            </h3>

            <p className="mt-2 font-iranYekan text-sm text-gray-500">
              در حال حاضر ملک مشابهی برای نمایش وجود ندارد.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

