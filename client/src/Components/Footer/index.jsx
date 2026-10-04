import { BsFillTelephoneFill } from "react-icons/bs";
import {
  FaInstagram,
  FaTelegramPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.png";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0e1431] text-white font-iranYekan">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 xl:px-10 py-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo & About */}
          <div className="lg:col-span-1">

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer mb-5"
            >
              <img
                src={logo}
                alt="سپهر املاک"
                className="w-16 h-16 object-contain"
              />

              <h2 className="text-2xl font-alibaba text-[#cba36f]">
                سپهر املاک
              </h2>
            </div>

            <p className="text-gray-300 text-sm leading-8">
              سپهر املاک، همراه مطمئن شما در خرید، فروش و اجاره
              انواع املاک. با ما ملک مناسب خود را راحت‌تر پیدا کنید.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#cba36f] hover:text-[#0e1431] transition"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#cba36f] hover:text-[#0e1431] transition"
              >
                <FaTelegramPlane size={18} />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-[#cba36f] mb-6">
              دسترسی سریع
            </h3>

            <ul className="space-y-4 text-sm">

              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-gray-300 hover:text-[#cba36f] transition cursor-pointer"
                >
                  صفحه اصلی
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/properties")}
                  className="text-gray-300 hover:text-[#cba36f] transition cursor-pointer"
                >
                  مشاهده املاک
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/wishlist")}
                  className="text-gray-300 hover:text-[#cba36f] transition cursor-pointer"
                >
                  علاقه‌مندی‌ها
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-gray-300 hover:text-[#cba36f] transition cursor-pointer"
                >
                  ارتباط با ما
                </button>
              </li>

            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-[#cba36f] mb-6">
              خدمات سپهر املاک
            </h3>

            <ul className="space-y-4 text-sm text-gray-300">

              <li className="hover:text-[#cba36f] transition">
                خرید و فروش ملک
              </li>

              <li className="hover:text-[#cba36f] transition">
                اجاره ملک
              </li>

              <li className="hover:text-[#cba36f] transition">
                ثبت ملک
              </li>

              <li className="hover:text-[#cba36f] transition">
                مشاوره املاک
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-[#cba36f] mb-6">
              ارتباط با ما
            </h3>

            <div className="space-y-5 text-sm">

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt
                  className="text-[#cba36f] mt-1 shrink-0"
                  size={18}
                />

                <p className="text-gray-300 leading-7">
                  مشهد، خیابان ...،
                  دفتر مرکزی سپهر املاک
                </p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt
                  className="text-[#cba36f]"
                  size={16}
                />

                <span
                  dir="ltr"
                  className="text-gray-300"
                >
                  051-33685185
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BsFillTelephoneFill
                  className="text-[#cba36f]"
                  size={16}
                />

                <span className="text-gray-300">
                  پاسخگویی در ساعات کاری
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 xl:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">

          <p className="text-gray-400">
            © {new Date().getFullYear()} سپهر املاک. تمامی حقوق محفوظ است.
          </p>

         

        </div>

      </div>

    </footer>
  );
}