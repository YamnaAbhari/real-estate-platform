import StatsSection from "./StatsSection";

import hero from "../../../../assets/images/hero.jpg";
import heroMobile from "../../../../assets/images/heroMobile.jpg";

import {
  FaArrowLeft,
  FaHome,
  FaCheck,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import notify from "../../../../Utils/Notify";

export default function HeroBanner() {
  const { token, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const submitPropertyButton = () => {
    if (!token) {
      navigate("/auth/login");
      return;
    }

    if (token && user?.role !== "seller") {
      notify("error", "فقط فروشندگان اجازه ی ثبت آگهی دارند");
      return;
    }

    navigate("/seller-dashboard");
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative h-[583px] overflow-hidden sm:h-[658px]">
        {/* ================= IMAGE ================= */}
        <picture>
          <source
            media="(max-width: 719px)"
            srcSet={heroMobile}
          />

          <img
            src={hero}
            alt="املاک سپهر"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {/* ================= OVERLAY ================= */}
        <div className="absolute inset-0 bg-[#0e1431]/5" />

        <div className="absolute inset-0 bg-gradient-to-l from-[#0e1431]/75 via-[#0e1431]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0e1431]/60 to-transparent" />

        {/* ================= CONTENT ================= */}
        <div
          dir="rtl"
          className="relative z-10 flex h-full items-center"
        >
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="max-w-2xl">

              {/* ================= SMALL LABEL ================= */}
              <motion.div
                initial={{
                  opacity: 0,
                  x: 35,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                }}
                className="mb-6 flex items-center gap-3"
              >
                <span className="h-px w-10 bg-gold" />

                <span className="font-iranYekan text-xs font-medium tracking-wide text-gold sm:text-sm">
                  سپهر | سامانه تخصصی املاک
                </span>
              </motion.div>

              {/* ================= TITLE ================= */}
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.25,
                  ease: "easeOut",
                }}
                className="font-alibaba text-4xl font-bold leading-[1.5] text-white sm:text-5xl lg:text-6xl"
              >
                جایی برای

                <span className="block text-gold">
                  شروع یک زندگی جدید
                </span>
              </motion.h1>

              {/* ================= DESCRIPTION ================= */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.55,
                  ease: "easeOut",
                }}
                className="mt-6 max-w-xl font-iranYekan text-sm leading-8 text-white/75 sm:text-base"
              >
                خانه‌ای که می‌خواهید، تنها یک جستجو با شما فاصله دارد.
                در سپهر، انتخابی مطمئن‌تر برای خرید، فروش و اجاره ملک
                داشته باشید.
              </motion.p>

              {/* ================= GOLD LINE ================= */}
              <motion.div
                initial={{
                  opacity: 0,
                  scaleX: 0,
                  transformOrigin: "right",
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.8,
                  ease: "easeOut",
                }}
                className="mt-7 flex items-center gap-3"
              >
                <div className="h-[3px] w-16 rounded-full bg-gold" />

                <div className="h-[3px] w-3 rounded-full bg-gold/50" />

                <div className="h-[3px] w-2 rounded-full bg-gold/30" />
              </motion.div>

              {/* ================= BUTTONS ================= */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 1,
                  ease: "easeOut",
                }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                {/* Primary */}
                <motion.button
                  type="button"
                  onClick={() => navigate("/properties")}
                  whileHover={{
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl bg-gold px-6 py-3.5 font-iranYekan text-sm font-bold text-[#0e1431] shadow-lg transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(203,163,111,0.25)]"
                >
                  مشاهده املاک

                  <motion.span
                    animate={{
                      x: [0, -4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <FaArrowLeft className="text-xs" />
                  </motion.span>
                </motion.button>

                {/* Secondary */}
                <motion.button
                  type="button"
                  onClick={submitPropertyButton}
                  whileHover={{
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 font-iranYekan text-sm text-white backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:bg-white/10"
                >
                  <FaHome className="text-gold" />

                  ثبت آگهی
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ================= FLOATING INFO ================= */}
        <motion.div
          dir="rtl"
          initial={{
            opacity: 0,
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 1.25,
            ease: "easeOut",
          }}
          className="absolute bottom-7 left-6 z-10 hidden rounded-2xl border border-white/10 bg-[#0e1431]/75 p-4 shadow-xl backdrop-blur-md sm:block lg:left-10"
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 1.45,
                type: "spring",
                stiffness: 180,
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10"
            >
              <FaCheck className="text-gold" />
            </motion.div>

            <div>
              <p className="font-alibaba text-sm font-bold text-white">
                انتخابی مطمئن
              </p>

              <p className="mt-1 font-iranYekan text-xs text-white/55">
                برای خانه و سرمایه شما
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= DECORATIVE CORNER ================= */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 1.3,
            ease: "easeOut",
          }}
          className="absolute bottom-0 right-0 h-24 w-24 border-r-2 border-b-2 border-gold/40"
        />
      </section>

      {/* ================= STATS ================= */}
      <StatsSection />
    </div>
  );
}