import {
  FaBuilding,
  FaCheckCircle,
  FaChartLine,
  FaHome,
  FaEye,
  FaUsers,
} from "react-icons/fa";

export default function ReportsSection({ statistics }) {
  const reports = [
    {
      title: "کل کاربران",
      value: statistics?.totalUsers ?? 0,
      description: "مجموع کاربران ثبت‌ نام‌شده",
      icon: FaUsers,
      featured: true,
    },
    {
      title: "کل املاک",
      value: statistics?.totalProperties ?? 0,
      description: "مجموع املاک ثبت‌ شده",
      icon: FaBuilding,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      accent: "bg-blue-500",
    },
    {
      title: "املاک موجود",
      value: statistics?.availableProperties ?? 0,
      description: "املاک در دسترس",
      icon: FaCheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-500",
    },
    {
      title: "فروخته‌ شده",
      value: statistics?.soldProperties ?? 0,
      description: "املاک فروخته‌ شده",
      icon: FaChartLine,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "bg-violet-500",
    },
    {
      title: "اجاره‌داده‌ شده",
      value: statistics?.rentedProperties ?? 0,
      description: "املاک اجاره‌داده‌ شده",
      icon: FaHome,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      accent: "bg-orange-500",
    },
    {
      title: "مجموع بازدید",
      value: statistics?.totalViews ?? 0,
      description: "مجموع بازدید از املاک",
      icon: FaEye,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
      accent: "bg-gold",
    },
  ];

  return (
    <section dir="rtl" className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-alibaba text-lg font-bold text-dark-blue">
          گزارش عملکرد
        </h2>

        <p className="mt-0.5 font-iranYekan text-xs text-gray-500">
          خلاصه‌ای از وضعیت کاربران و املاک
        </p>
      </div>

      {/* Reports */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <div
              key={report.title}
              className={`relative overflow-hidden rounded-2xl p-4 transition-shadow duration-200 hover:shadow-md ${
                report.featured
                  ? "bg-dark-blue text-white"
                  : "border border-gray-100 bg-white"
              }`}
            >
              {/* Accent Line */}
              {!report.featured && (
                <span
                  className={`absolute inset-x-0 top-0 h-0.5 ${report.accent}`}
                />
              )}

              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    report.featured ? "bg-white/10" : report.iconBg
                  }`}
                >
                  <Icon
                    className={`text-base ${
                      report.featured
                        ? "text-gold"
                        : report.iconColor
                    }`}
                  />
                </div>

                <p
                  className={`font-iranYekan text-sm font-medium ${
                    report.featured
                      ? "text-white/80"
                      : "text-gray-600"
                  }`}
                >
                  {report.title}
                </p>
              </div>

              {/* Value */}
              <h3
                className={`mt-4 font-alibaba text-2xl font-bold ${
                  report.featured
                    ? "text-white"
                    : "text-dark-blue"
                }`}
              >
                {Number(report.value).toLocaleString("fa-IR")}
              </h3>

              {/* Description */}
              <p
                className={`mt-1 font-iranYekan text-xs ${
                  report.featured
                    ? "text-white/50"
                    : "text-gray-400"
                }`}
              >
                {report.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}