
import {
  HiShieldCheck,
  HiLightningBolt,
  HiCurrencyDollar,
  HiVideoCamera,
} from "react-icons/hi";

const WhyUs = () => {
  const features = [
    {
      title: "اعتماد و اعتبار",
      desc: "تمامی املاک پیش از انتشار از نظر اطلاعات، مالکیت و مشخصات بررسی می‌شوند.",
      icon: <HiShieldCheck size={24} />,
    },
    {
      title: "جستجوی هوشمند",
      desc: "با استفاده از فیلترهای دقیق، ملک مورد نظر خود را سریع‌تر و راحت‌تر پیدا کنید.",
      icon: <HiLightningBolt size={24} />,
    },
    {
      title: "بهترین انتخاب",
      desc: "املاک متنوع با اطلاعات کامل در اختیار شما قرار می‌گیرند تا انتخابی مطمئن داشته باشید.",
      icon: <HiCurrencyDollar size={24} />,
    },
    {
      title: "بازدید مجازی",
      desc: "پیش از مراجعه حضوری، تصاویر و اطلاعات کامل ملک را مشاهده و بررسی کنید.",
      icon: <HiVideoCamera size={24} />,
    },
  ];

  return (
    <section
      className="bg-dark-blue py-16 px-4 font-iranYekan"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* متن */}
          <div className="text-light">

            <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed text-gold font-alibaba">
              چرا ما انتخاب بهتری برای شما هستیم؟
            </h2>

            <p className="mt-5 text-light/70 text-sm md:text-base leading-8 max-w-xl">
              ما تجربه جستجو و انتخاب ملک را ساده‌تر و مطمئن‌تر کرده‌ایم.
              با ارائه اطلاعات دقیق، جستجوی هوشمند و دسترسی به مجموعه‌ای
              متنوع از املاک، به شما کمک می‌کنیم تا ملک مناسب خود را
              با اطمینان بیشتری پیدا کنید.
            </p>

            <button
              className="
                mt-7
                inline-flex items-center gap-2
                text-sm font-semibold
                text-gold
                hover:text-light
                transition-colors
              "
            >
              بیشتر درباره خدمات ما
              <span>←</span>
            </button>
          </div>

          {/* ویژگی‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="
                  group
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  p-5
                  transition-all duration-300
                  hover:bg-white/10
                  hover:border-gold/40
                "
              >
                <div
                  className="
                    flex items-center justify-center
                    w-11 h-11
                    rounded-xl
                    bg-gold/10
                    text-gold
                    mb-4
                    transition-all duration-300
                    group-hover:bg-gold
                    group-hover:text-dark-blue
                  "
                >
                  {feature.icon}
                </div>

                <h3 className="text-base font-bold text-[#cba36f]">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs md:text-sm text-light/60 leading-7 text-[#fafafac5]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyUs;