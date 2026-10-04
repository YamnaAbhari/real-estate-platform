import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { HiOutlineHome } from "react-icons/hi2";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { LuClock3, LuStar } from "react-icons/lu";

const AnimatedCounter = ({ value, suffix = "" }) => {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("fa-IR")
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 5,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [count, value]);

  return (
    <span className="relative inline-block tabular-nums">
      {/* فضای رزرو شده */}
      <span className="invisible">
        {value.toLocaleString("fa-IR")}
        {suffix}
      </span>

      {/* عدد انیمیشنی */}
      <span className="absolute inset-0 flex items-center justify-center">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </span>
    </span>
  );
};

const StatsSection = () => {
  const stats = [
    { number: 150, suffix: "+", label: "ملک فروخته شده", icon: HiOutlineHome },
    { number: 100, suffix: "+ ",unit: "میلیارد ",  label: "حجم فروش", icon: RiMoneyDollarCircleLine },
    { number: 10, suffix: "+", label: "سال تجربه", icon: LuClock3 },
    { number: 98, suffix: "%", label: "رضایت مشتریان", icon: LuStar },
  ];

  return (
    <section
      className="bg-dark-blue py-7  w-full px-5 font-iranYekan"
      dir="rtl"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 "
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`flex flex-col items-center justify-center py-4 px-3 group ${
                index < stats.length - 1 ? "md:border-l md:border-gray-200/30" : ""
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="text-[#CBA36F] text-2xl md:text-4xl transition-transform duration-300 group-hover:scale-110">
                  <Icon />
                </div>

                <div className="flex flex-col">
                <div className="flex gap-1 justify-between">
                   <span className="text-xl md:text-[26px] font-bold text-light leading-none">
                    <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                  </span>
                  {stat?.unit && <span className="text-[16px] font-bold text-light">{stat.unit}</span>}
                </div>

                  <span className="text-xs md:text-sm text-gold mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default StatsSection;