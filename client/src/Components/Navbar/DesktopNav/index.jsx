import { useEffect, useState } from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../../Store/AuthSlice";

export default function DesktopNav() {
  const { token, user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`w-full h-20 z-49 flex items-center justify-between px-5 xl:px-10 fixed ${
        isScrolled
          ? "bg-[#cba36f]/5 backdrop-blur-md shadow-md transition"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-[#cba36f] flex items-center cursor-pointer"
      >
        <img src={logo} className="w-15 h-15"></img>
        <h1 className="font-alibaba">سپهر املاک</h1>
      </div>

      {/* Menu */}
      <div className="bg-[#cba36f] rounded-full px-8 py-3 flex items-center gap-8 font-iranYekan text-sm">

        {token && user?.role === "seller" && (
          <a
            href="/seller-dashboard"
            className="text-white hover:text-[#141D43] hover:font-bold transition"
          >
            داشبورد فروشنده
          </a>
        )}

        {token && user?.role === "admin" && (
          <a
            href="/admin-dashboard"
            className="text-white hover:text-[#141D43] hover:font-bold transition"
          >
            داشبورد ادمین
          </a>
        )}

        {!token && (
          <a
            onClick={() => navigate("/auth/register")}
            className="text-white hover:text-[#141D43] hover:font-bold transition cursor-pointer"
          >
            ثبت نام
          </a>
        )}

        {!token && (
          <a
            onClick={() => navigate("/auth/login")}
            className="text-white hover:text-[#141D43] hover:font-bold transition cursor-pointer"
          >
            ورود
          </a>
        )}

        <a
          href="/properties"
          className="text-white hover:text-[#141D43] hover:font-bold transition"
        >
          مشاهده املاک
        </a>

        {user?.role !== "seller" && user?.role !== "admin" && (
          <a
            href="/contact"
            className="text-white hover:text-[#141D43] hover:font-bold transition"
          >
            ارتباط با ما
          </a>
        )}

        {token && user?.role !== "admin" && user?.role !== "seller" && (
          <a
            href="/wishlist"
            className="text-white hover:text-[#141D43] hover:font-bold transition"
          >
            علاقه مندی ها
          </a>
        )}

         {token && user?.role !== "admin" && user?.role !== "seller" && (
          <a
            href="/chat"
            className="text-white hover:text-[#141D43] hover:font-bold transition"
          >
           پیام ها
          </a>
        )}

        
      </div>

      <div className="flex gap-2 items-center h-full ">
        {token && (
          <button
            onClick={() => {
              dispatch(logout());
            }}
            type="button"
            className="
            w-full h-11 px-2
            rounded-xl
            border-2 border-gold
            text-gold
            flex items-center justify-center gap-1
            transition-all duration-200
            cursor-pointer
            font-iranYekan
          "
          >
            <FaSignOutAlt size={16} />
            <span>خروج</span>
          </button>
        )}

        {token ? (
          user?.profilePic ? (
            <div
              onClick={() => navigate("/profile")}
              className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gold cursor-pointer"
            >
              <img
                src={import.meta.env.VITE_BASE_FILE + user.profilePic}
                alt={Array.from(user?.name || "کاربر")[0]}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              onClick={() => navigate("/profile")}
              className="w-12 h-12 rounded-full bg-dark-blue flex items-center justify-center text-white font-bold text-lg shrink-0 cursor-pointer font-iranYekan"
            >
              {Array.from(user?.name || "?")[0]}
            </div>
          )
        ) : null}

        {!token && (
          <div className="text-xl font-bold text-[#141D43] flex items-center gap-1 bg-[#cba36f] py-2 px-3 rounded-full">
            <h1 className="text-sm">33685185 (051)</h1>
            <BsFillTelephoneFill />
          </div>
        )}
      </div>
    </nav>
  );
}
