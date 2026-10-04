import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaClipboardList,
  FaComments,
  FaEnvelopeOpenText,
  FaHeadset,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { logout } from "../../../Store/AuthSlice";

export default function MobileSidebar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);


  // seller menu
  const sellerMenuItems = [
    {
      title: "داشبورد",
      path: "/seller-dashboard",
      icon: MdDashboard,
    },
    {
      title: "املاک من",
      path: "/seller-dashboard/my-listings",
      icon: FaBuilding,
    },
    {
      title: "پیام‌ها",
      path: "/chat",
      icon: FaComments,
    },
    {
      title: "پروفایل",
      path: "/seller-dashboard/profile",
      icon: FaUser,
    },
    {
      title: "پشتیبانی",
      path: "/seller-dashboard/contact",
      icon: FaHeadset,
    },
  ];

  // admin menu
  const adminMenuItems = [
    {
      title: "داشبورد",
      path: "/admin-dashboard",
      icon: MdDashboard,
    },
    {
      title: "کاربران",
      path: "/admin-dashboard/users",
      icon: FaUsers,
    },
    {
      title: "درخواست‌های فروشندگی",
      path: "/admin-dashboard/seller-requests",
      icon: FaClipboardList,
    },
    {
      title: "املاک",
      path: "/admin-dashboard/properties",
      icon: FaHome,
    },
    {
      title: "صندوق پیام‌ها",
      path: "/admin-dashboard/contact-inbox",
      icon: FaEnvelopeOpenText,
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : sellerMenuItems;

  const panelTitle = user?.role === "admin" ? "پنل مدیریت" : "پنل فروشنده";

  const profilePath =
    user?.role === "admin"
      ? "/admin-dashboard/profile"
      : "/seller-dashboard/profile";

  return (
    <>
      <nav
        className={`w-full h-15 flex z-49 items-center justify-between max-[330px]:px-2 px-5 xl:px-10 fixed top-0 right-0${
          isScrolled
            ? "bg-[#cba36f]/5 backdrop-blur-md shadow-md transition"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-[#cba36f] flex items-center"
        >
          <img src={logo} className="w-10 h-10"></img>
          <h1 className="font-alibaba text-[20px] ">سپهر املاک</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex justify-center items-center rounded-xl bg-[#cba36f]/20 backdrop-blur-md shadow-md border border-[#cba36f]"
          >
            {isMenuOpen ? (
              <IoClose className="text-dark-blue text-[22px]" />
            ) : (
              <HiMenuAlt2 className="text-dark-blue text-[22px]" />
            )}
          </button>
        </div>
      </nav>

      {/* SIDE BAR */}
      {/* Overlay */}
      <div
        className={`
              fixed inset-0 z-50
              ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}
            `}
      >
        {/* Blur */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`
                absolute inset-0
                bg-black/20
                backdrop-blur-md
                transition-opacity duration-300
                ${isMenuOpen ? "opacity-95" : "opacity-0"}
              `}
        />

        {/* Sidebar */}
        <div
          className={`
                absolute top-0 right-0 max-w-full
                h-full w-75
                transition-transform duration-300 ease-in-out
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
              `}

              onClick={()=>setIsMenuOpen(false)}
        >
          <aside
            dir="rtl"
            className="
        fixed right-0 top-0 z-40
        flex h-screen w-64 flex-col
        bg-dark-blue
        shadow-xl
        font-iranYekan
      "
          >
            {/* Logo */}
            <div className="flex h-20 items-center border-b border-white/10 px-6">
              <div className="flex items-center gap-3">
                <div>
                  {token ? (
                    user?.profilePic ? (
                      <div
                        onClick={() => navigate(profilePath)}
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
                        onClick={() => navigate(profilePath)}
                        className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg shrink-0 cursor-pointer font-iranYekan"
                      >
                        {Array.from(user?.name || "?")[0]}
                      </div>
                    )
                  ) : null}
                </div>
                <div>
                  <h1 className="font-alibaba text-lg font-bold text-white">
                    سپهر املاک
                  </h1>
                  <p className="mt-0.5 font-iranYekan text-[11px] text-gray-400">
                    {panelTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6">
              <p className="mb-4 px-3 font-alibaba text-xs text-gray-500">
                منوی اصلی
              </p>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end
                      className={({ isActive }) => `
                  group flex h-12 items-center gap-3 rounded-xl px-4
                  font-alibaba text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-gold text-dark-blue shadow-md"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`
                        text-[17px] transition-colors
                        ${
                          isActive
                            ? "text-dark-blue"
                            : "text-gold group-hover:text-gold"
                        }
                      `}
                          />
                          <span>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            {/* log out */}
            <div
              className="m-4 pb-2"
              onClick={() => {
                dispatch(logout());
              }}
            >
              <button
                type="button"
                className="
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
          </aside>
        </div>
      </div>
    </>
  );
}
