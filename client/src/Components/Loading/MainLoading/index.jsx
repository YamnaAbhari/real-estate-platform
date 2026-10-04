import logo from "../../../assets/images/logo.png";

export default function MainLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0e1431] flex flex-col items-center justify-center">

      {/* Logo */}
      <div className="relative flex items-center justify-center">
        {/* Glow */}
        <div className="absolute w-32 h-32 bg-[#cba36f]/20 rounded-full blur-2xl animate-pulse"></div>

        <img
          src={logo}
          alt="سپهر املاک"
          className="relative w-24 h-24 object-contain animate-pulse"
        />
      </div>

      {/* Name */}
      <h1 className="mt-4 text-2xl text-[#cba36f] font-alibaba">
        سپهر املاک
      </h1>

      {/* Loading line */}
      <div className="mt-7 w-44 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-[#cba36f] rounded-full animate-loading"></div>
      </div>

      <p className="mt-4 text-sm text-white/50 font-iranYekan">
        در حال بارگذاری...
      </p>

    </div>
  );
}