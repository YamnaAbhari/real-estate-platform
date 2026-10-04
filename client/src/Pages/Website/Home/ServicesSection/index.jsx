import { FaHome, FaChartLine, FaBuilding, FaKey } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";

import hero from "../../../../assets/images/hero.jpg";

const services = [
  {
    icon: FaHome,
    title: "خرید و فروش ملک",
    description:
      "برای خرید یا فروش ملک، گزینه‌های مناسب را با اطلاعات کامل و شفاف پیدا کنید.",
  },
  {
    icon: FaChartLine,
    title: "مشاوره سرمایه‌گذاری",
    description:
      "با بررسی موقعیت و ارزش ملک، برای سرمایه‌گذاری آگاهانه‌تر تصمیم بگیرید.",
  },
  {
    icon: FaBuilding,
    title: "مدیریت املاک",
    description:
      "مدیریت و پیگیری حرفه‌ای املاک با اطلاعات منظم و دسترسی آسان.",
  },
  {
    icon: FaKey,
    title: "اجاره ملک",
    description:
      "خانه‌ها و املاک مناسب برای اجاره را در موقعیت‌های مختلف پیدا کنید.",
  },
];

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      className="group relative h-full overflow-hidden rounded-[22px] border border-white/25 bg-[#0e1431]/45 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-[#cba36f]/70 hover:bg-[#0e1431]/60"
    >
      {/* نور طلایی گوشه کارت */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
          delay: index * 0.12 + 0.2,
        }}
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#cba36f]/10 blur-2xl transition-all duration-500 group-hover:bg-[#cba36f]/20"
      />

      {/* Icon */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
          rotate: -15,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.6,
          delay: index * 0.12 + 0.25,
          type: "spring",
          stiffness: 120,
        }}
        className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#cba36f]/70 text-[#cba36f] transition-all duration-500 group-hover:bg-[#cba36f] group-hover:text-[#0e1431]"
      >
        <Icon className="text-xl" />
      </motion.div>

      {/* Text */}
      <div className="relative">
        <h3 className="font-alibaba text-xl font-semibold text-white">
          {service.title}
        </h3>

        {/* خط طلایی */}
        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: 40,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.12 + 0.45,
          }}
          className="my-4 h-px bg-[#cba36f] transition-all duration-500 group-hover:!w-16"
        />

        <p className="font-iranYekan text-sm leading-7 text-white/70">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
};

export default function ServicesSection() {
  return (
    <section
      dir="rtl"
      className="relative mb-40 overflow-hidden bg-[#0e1431] py-20 sm:mb-10 sm:py-24"
    >
      {/* =========================
          Background Image
      ========================= */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${hero})`,
        }}
      />

      {/* =========================
          Overlay
      ========================= */}
      <div className="absolute inset-0 bg-[#0e1431]/10" />

      {/* =========================
          Gradient
      ========================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1431]/60 via-[#0e1431]/50 to-[#0e1431]" />

      {/* =========================
          Content
      ========================= */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* =========================
            Header
        ========================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-12 flex items-end justify-between gap-6 sm:mb-14"
        >
          <div>
            {/* Small Title */}
            <motion.span
              initial={{
                opacity: 0,
                x: 25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="mb-3 block font-iranYekan text-sm font-medium tracking-wide text-[#cba36f]"
            >
              خدمات سپهر
            </motion.span>

            {/* Main Title */}
            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              className="font-alibaba text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              خدمات تخصصی املاک
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="hidden max-w-md text-left font-iranYekan text-sm leading-7 text-white/60 md:block"
          >
            از خرید و فروش تا اجاره و سرمایه‌گذاری، سپهر در تمام مسیر انتخاب
            ملک همراه شماست.
          </motion.p>
        </motion.div>

        {/* =========================
            Desktop
        ========================= */}
        <div className="hidden grid-cols-4 gap-4 lg:grid">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* =========================
            Mobile / Tablet Slider
        ========================= */}
        <div className="lg:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={false}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 18,
              },
            }}
            className="services-swiper !pb-12"
          >
            {services.map((service, index) => (
              <SwiperSlide
                key={service.title}
                className="!h-auto"
              >
                <ServiceCard
                  service={service}
                  index={index}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* =========================
          Swiper Pagination Style
      ========================= */}
      <style>
        {`
          .services-swiper .swiper-pagination {
            bottom: 0;
          }

          .services-swiper .swiper-pagination-bullet {
            width: 7px;
            height: 7px;
            margin: 0 4px !important;
            background: #cba36f;
            opacity: 0.35;
            transition: all 0.3s ease;
          }

          .services-swiper .swiper-pagination-bullet-active {
            width: 22px;
            border-radius: 999px;
            background: #cba36f;
            opacity: 1;
          }
        `}
      </style>
    </section>
  );
}