import { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import { HiMenuAlt2 } from "react-icons/hi";
import Sidebar from "./sidebar";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MobileNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
  
  return (
    <>
      <nav
        className={`w-full h-15 flex z-49 items-center justify-between max-[330px]:px-2 px-5 xl:px-10 fixed ${
          isScrolled
            ? "bg-[#cba36f]/5 backdrop-blur-md shadow-md transition"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div onClick={()=>navigate('/')} className="text-2xl font-bold text-[#cba36f] flex items-center">
          <img src={logo} className="w-10 h-10"></img>
          <h1 className="font-alibaba text-[20px] ">سپهر املاک</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile */}

          {token ? (
            user?.profilePic ? (
              <div
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gold cursor-pointer"
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
                className="w-10 h-10 rounded-full bg-dark-blue flex items-center justify-center text-white font-bold text-lg shrink-0 cursor-pointer text-iranYekan"
              >
                {Array.from(user?.name || "?")[0]}
              </div>
            )
          ) : null}

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
        >
          <Sidebar setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </>
  );
}
