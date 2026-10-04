import {
  FaBuilding,
  FaCheckCircle,
  FaChartLine,
  FaHome,
  FaEye,
} from "react-icons/fa";

export default function ReportsSection({ statistics }) {
  const reports = [
    {
      title: "کل املاک",
      value: statistics?.totalProperties ?? 0,
      description: "مجموع املاک ثبت‌شده",
      icon: FaBuilding,
      featured: true,
    },
    {
      title: "املاک فعال",
      value: statistics?.activeListings ?? 0,
      description: "املاک در حال نمایش",
      icon: FaCheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "bg-emerald-500",
    },
    {
      title: "فروخته‌شده",
      value: statistics?.soldProperties ?? 0,
      description: "املاک فروخته‌شده",
      icon: FaChartLine,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      accent: "bg-violet-500",
    },
    {
      title: "اجاره‌داده‌شده",
      value: statistics?.rentedProperties ?? 0,
      description: "املاک اجاره‌داده‌شده",
      icon: FaHome,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      accent: "bg-orange-500",
    },
    {
      title: "مجموع بازدید",
      value: statistics?.totalViews ?? 0,
      description: "بازدید از تمام املاک",
      icon: FaEye,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
      accent: "bg-gold",
    },
  ];

  return (
    <section dir="rtl" className="w-full">
      <div className="mb-4">
        <h2 className="font-alibaba text-lg font-bold text-dark-blue">
          گزارش عملکرد
        </h2>
        <p className="mt-0.5 font-iranYekan text-xs text-gray-500">
          خلاصه‌ای از وضعیت املاک و عملکرد شما
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
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
              {/* accent line */}
              {!report.featured && (
                <span
                  className={`absolute inset-x-0 top-0 h-0.5 ${report.accent}`}
                />
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    report.featured ? "bg-white/10" : report.iconBg
                  }`}
                >
                  <Icon
                    className={`text-base ${
                      report.featured ? "text-gold" : report.iconColor
                    }`}
                  />
                </div>

                <p
                  className={`font-iranYekan text-sm font-medium ${
                    report.featured ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  {report.title}
                </p>
              </div>

              <h3
                className={`mt-4 font-alibaba text-2xl font-bold ${
                  report.featured ? "text-white" : "text-dark-blue"
                }`}
              >
                {report.value.toLocaleString("fa-IR")}
              </h3>

              <p
                className={`mt-1 font-iranYekan text-xs ${
                  report.featured ? "text-white/50" : "text-gray-400"
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