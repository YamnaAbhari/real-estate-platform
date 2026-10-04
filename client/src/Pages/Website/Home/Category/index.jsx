import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";


import "swiper/css";
import "swiper/css/navigation";
import { categories } from "../../../../data/categories";

const Category = () => {
  const navigate = useNavigate();



  const handleCategoryClick = (value) => {
    navigate(`/properties/${value}`);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 0.1,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-light py-14 px-4 font-iranYekan" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-blue">
            دسته‌بندی املاک
          </h2>

          <div className="w-12 h-1 bg-gold rounded-full mt-3" />

          <p className="text-sm text-gray-500 mt-3">
            ملک مورد نظر خود را بر اساس نوع انتخاب کنید
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                initial={{ opacity: 0, y: 1 }}
                whileInView={{ opacity: 1, y: 5 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="
          group
          flex flex-col items-center justify-center
          h-36
          bg-white
          border border-gray-100
          rounded-2xl
          cursor-pointer
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-gold
          hover:shadow-md
        "
              >
                <div
                  className="
            flex items-center justify-center
            w-14 h-14
            rounded-full
            bg-gold/10
            text-gold
            transition-all duration-300
            group-hover:bg-gold
            group-hover:text-light
          "
                >
                  <Icon className="w-7 h-7" />
                </div>

                <span className="mt-4 text-sm font-bold text-dark-blue">
                  {category.title}
                </span>
              </motion.div>
            );
          })}
        </div>
        {/* Mobile / Tablet */}

        <div className="md:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Swiper
              modules={[Navigation]}
              spaceBetween={12}
              slidesPerView="auto"
              className="w-full"
            >
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <SwiperSlide
                    key={category.value}
                    style={{
                      width: "130px",
                    }}
                  >
                    <motion.div
                      variants={itemVariants}
                      onClick={() => handleCategoryClick(category.value)}
                      className="
                group
                flex flex-col items-center justify-center
                h-32
                bg-white
                border border-gray-100
                rounded-2xl
                cursor-pointer
                shadow-sm
                transition-all duration-300
                active:scale-95
              "
                    >
                      <div
                        className="
                  flex items-center justify-center
                  w-12 h-12
                  rounded-full
                  bg-gold/10
                  text-gold
                "
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="mt-3 text-sm font-bold text-dark-blue">
                        {category.title}
                      </span>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Category;
