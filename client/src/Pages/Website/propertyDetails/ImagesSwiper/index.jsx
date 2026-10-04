import { useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import FetchData from "../../../../Utils/FetchData";
import notify from "../../../../Utils/Notify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoClose } from "react-icons/io5";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function ImagesSwiper({ propertyId, property }) {
  const { user, token } = useSelector((state) => state.auth);
  const [isWishlist, setIsWishlist] = useState(false);
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  // Swiper thumbnails
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLightboxOpen]);

  // =========================
  // Wishlist
  // =========================
  useEffect(() => {
    (async () => {
      if (!token) {
        setIsWishlist(false);
        return;
      }
      if (user?.role !== "buyer") {
        return;
      }
      try {
        const result = await FetchData(`wishlists/${propertyId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.success) {
          setIsWishlist(result.data.isWishlist);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [propertyId, token, user]);

  // =========================
  // Wishlist Toggle
  // =========================
  const handleWishlistToggle = async () => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    if (user?.role !== "buyer") {
      return;
    }
    const result = await FetchData(`wishlists/${propertyId}`, {
      method: isWishlist ? "DELETE" : "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!result.success) {
      notify("error", result.message);
      return;
    }

    setIsWishlist((prev) => !prev);
  };

  const images = property.images || [];
  return (
    <div>
      {/* =========================
                MAIN SWIPER
            ========================= */}
      <div className="relative sm:px-8 md:px-15 lg:px-0">
        <Swiper
          modules={[Thumbs]}
          navigation
          pagination={{
            clickable: true,
          }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          spaceBetween={10}
          slidesPerView={1}
          dir="rtl"
          className=" rounded-3xl overflow-hidden "
          onSlideChange={(swiper) => {
            setSelectedImage(swiper.activeIndex);
          }}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="
                          relative
                          
                          w-full
                          h-70
                          sm:h-100
                          lg:h-125
                          bg-gray-200
                        "
                >
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt={`${property.title} ${index + 1}`}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsLightboxOpen(true);
                    }}
                    className="
                            w-full
                            h-full
                            object-cover
                            cursor-pointer
                          "
                  />

                  {/* Image Counter */}
                  <div
                    className="
                            absolute
                            top-4
                            left-4
                            z-10
                            px-3
                            py-1.5
                            rounded-full
                            bg-black/50
                            backdrop-blur-sm
                            text-white
                            text-xs
                          "
                  >
                    {index + 1} / {images.length}
                  </div>

                  {/* Wishlist */}
                  {user?.role == "buyer" && (
                    <button
                      onClick={() => {
                        handleWishlistToggle();
                      }}
                      type="button"
                      className="absolute top-3 right-3 w-10 h-10 rounded-full
                     bg-white/90 backdrop-blur-sm
                     flex items-center justify-center
                     shadow-md cursor-pointer
                     hover:scale-110 transition-all duration-200"
                    >
                      {isWishlist ? (
                        <FaHeart className="text-red-500 text-[19px]" />
                      ) : (
                        <FaRegHeart className="text-gold text-[19px]" />
                      )}
                    </button>
                  )}
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div
                className="
                        w-full
                        h-70
                        sm:h-100
                        lg:h-125
                        flex
                        items-center
                        justify-center
                        bg-gray-200
                        text-gray-400
                      "
              >
                تصویری برای این ملک وجود ندارد
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* =========================
                THUMBNAIL SWIPER
            ========================= */}
      <div className="sm:px-8 md:px-15 lg:px-0">
        {images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            breakpoints={{
              480: {
                slidesPerView: 5,
              },
              1024: {
                slidesPerView: 4,
              },
              1440: {
                slidesPerView: 5,
              },
            }}
            dir="rtl"
            className="property-thumbs-swiper mt-4 "
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="
                        h-20
                        sm:h-24
                        rounded-xl
                        overflow-hidden
                        cursor-pointer
                      "
                >
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt={`${property.title} ${index + 1}`}
                    className="
                          w-full
                          h-full
                          object-cover
                        "
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* =========================================
          LIGHTBOX
      ========================================= */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="
            fixed
            inset-0
            z-100
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="
              absolute
              top-5
              right-5
              z-110
              w-11
              h-11
              rounded-full
              bg-white/10
              text-white
              flex
              items-center
              justify-center
              text-2xl
              hover:bg-white/20
              transition
              cursor-pointer
            "
          >
            <IoClose />
          </button>

          {/* Lightbox Swiper */}
          <div
            className="w-full max-w-3xl rounded-4xl md:h-110 sm:h-85 h-60 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              navigation
              initialSlide={selectedImage}
              slidesPerView={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              dir="rtl"
              className="flex items-center justify-center h-full w-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={import.meta.env.VITE_BASE_FILE + image}
                    alt={`${property.title} ${index + 1}`}
                    className="
                        w-full
                        h-full  
                        rounded-2xl
                        overflow-hidden

                      "
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="
      absolute
      top-1/2
      -translate-y-1/2
      left-3
      z-200
      w-10
      h-10
      rounded-full
      bg-black/50
      flex
      items-center
      justify-center
      cursor-pointer
    "
            >
              <BsChevronLeft className="text-lg text-gold" />
            </button>

            {/* دکمه بعدی */}
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="
      absolute
      top-1/2
      -translate-y-1/2
      right-3
      z-50
      w-10
      h-10
      rounded-full
      bg-black/50
      flex
      items-center
      justify-center
      cursor-pointer
    "
            >
              <BsChevronRight className="text-lg text-gold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
