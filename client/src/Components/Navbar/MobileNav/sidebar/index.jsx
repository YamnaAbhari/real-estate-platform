import { IoClose } from "react-icons/io5";
import {
  FaBuilding,
  FaHeart,
  FaComments,
  FaPhone,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import logo from "../../../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../Store/AuthSlice";

export default function Sidebar({ setIsMenuOpen }) {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <aside
      className="
        fixed top-0 right-0 z-50 max-w-full
        w-75 h-screen
        bg-dark-blue
        text-white
        shadow-2xl
        font-iranYekan
        overflow-hidden
      "
    >
      <div className="relative h-full w-full">
        {/* ================= Header ================= */}
        <div className="h-24 px-4 flex items-center justify-between border-b border-white/10">
          {/* Logo + Name */}
          <div className="text-2xl font-bold text-[#cba36f] flex items-center ">
            <img
              src={logo}
              className="w-15 h-15 object-contain"
              alt="سپهر املاک"
            />

            <h1 className="font-alibaba text-lg whitespace-nowrap">
              سپهر املاک
            </h1>
          </div>

          {/* Close */}
          <button
            onClick={() => setIsMenuOpen(false)}
            type="button"
            className="
            w-9 h-9
            rounded-full
            flex items-center justify-center
            text-white/70
            hover:text-white
            hover:bg-white/10
            transition-all duration-200
            cursor-pointer
          "
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* ================= Menu ================= */}
        <nav className="flex-1 flex items-center px-5 mt-15 my-10">
          <div className="w-full flex flex-col gap-3">
            
            {token && user?.role === "seller" && (
              <button
                onClick={() => {
                  return (navigate("/seller-dashboard"), setIsMenuOpen(false));
                }}
                className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              >
                <MdDashboard size={17}/>
                <span>داشبورد فروشنده</span>
              </button>
            )
            }
            {/* ثبت نام */}
            {!token && (
              <button
                onClick={() => {
                  return (navigate("/auth/register"), setIsMenuOpen(false));
                }}
                className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              >
                <FaUserPlus size={17} />
                <span>ثبت نام</span>
              </button>
            )}

            {/* ورود */}
            {!token && (
              <button
                onClick={() => {
                  return (navigate("/auth/login"), setIsMenuOpen(false));
                }}
                className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              >
                <FaSignInAlt size={17} />
                <span>ورود</span>
              </button>
            )}

            {/* مشاهده املاک */}
            <button
              className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              onClick={() => {
                return (navigate("/properties"), setIsMenuOpen(false));
              }}
            >
              <FaBuilding size={17} />
              <span>مشاهده املاک</span>
            </button>

            {/* ارتباط با ما */}
            {user?.role !== "seller" && user?.role !== "admin" && (
              <button
                onClick={() => navigate("/contact")}
                className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              >
                <FaPhone size={17} />
                <span>ارتباط با ما</span>
              </button>
            )}

            {/* علاقه مندی ها */}
            {token && user?.role !== "seller" && user?.role !== "admin" && (
              <button
                onClick={() => navigate("/wishlist")}
                className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              >
                <FaHeart size={17} />
                <span>علاقه مندی ها</span>
              </button>
            )}

            {/* پیام ها */}
            {token && user?.role !== "admin" && user?.role !== "seller" && (
              <button
                onClick={() => navigate("/chat")}
                className="
              w-full h-12 px-5
              flex items-center gap-4
              rounded-xl
              text-white/80
              hover:bg-[#cba36f]
              hover:text-white
              transition-all duration-200
              cursor-pointer
              text-right
            "
              >
                <FaComments size={17} />
                <span>پیام ها</span>
              </button>
            )}
          </div>
        </nav>

        {/* ================= User ================= */}

        {token && (
          <div className="px-5 pb-6 absolute bottom-0 w-full">
            {/* User Info */}
            <div
              className="
            flex items-center gap-3
            p-3
            rounded-2xl
            bg-white/5
            border border-white/10
          "
            >
              {/* Profile */}
              {user?.profilePic ? (
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gold ">
                  <img
                    src={import.meta.env.VITE_BASE_FILE + user?.profilePic}
                    alt={user?.name?.charAt(0) || "ی"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="
              w-12 h-12
              rounded-full
              bg-[#cba36f]
              flex items-center justify-center
              text-white
              font-bold
              text-lg
              shrink-0
            "
                >
                  {user?.name?.charAt(0) || "ی"}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm text-white/50 mb-1">خوش آمدید</span>

                <span className="text-sm font-semibold truncate">
                  {user?.name || "نام کاربر"}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                dispatch(logout());
                setIsMenuOpen(false);
              }}
              type="button"
              className="
            mt-3
            w-full h-11
            rounded-xl
            border-2 border-gold
            text-gold
            flex items-center justify-center gap-2
            transition-all duration-200
            cursor-pointer
          "
            >
              <FaSignOutAlt size={16} />
              <span>خروج از حساب کاربری</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
