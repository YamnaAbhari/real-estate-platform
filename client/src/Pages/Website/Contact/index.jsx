import { useState } from "react";

import { useSelector } from "react-redux";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaCommentAlt,
  FaPaperPlane,
  FaHeadset,
} from "react-icons/fa";

import { motion } from "framer-motion";

import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";

export default function Contact() {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify("error", "لطفاً نام خود را وارد کنید");
      return;
    }

    if (!formData.email.trim()) {
      notify("error", "لطفاً ایمیل خود را وارد کنید");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      notify("error", "لطفاً شماره تلفن را وارد کنید");
      return;
    }

    if (!formData.subject.trim()) {
      notify("error", "لطفاً موضوع خود را وارد کنید");
      return;
    }

    if (!formData.message.trim()) {
      notify("error", "لطفاً پیام خود را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      const result = await FetchData("contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!result.success) {
        notify("error", result.message || "ارسال پیام با خطا مواجه شد");
        return;
      }

      notify("success", "پیام شما با موفقیت ارسال شد");

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      notify("error", error.message || "خطایی در ارسال پیام رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      dir="rtl"
      className="min-h-screen w-full bg-light px-4 py-30 sm:px-6 lg:px-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-alibaba text-2xl font-bold text-dark-blue sm:text-3xl">
            ارتباط با ما
          </h1>

          <p className="mt-3 font-iranYekan text-sm text-gray-500 sm:text-base">
            سوال یا پیشنهادی دارید؟ خوشحال می‌شویم از شما بشنویم.
          </p>
        </motion.div>

        {/* ================= CONTENT ================= */}
        <motion.div
          className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {/* ================= LEFT SIDE ================= */}
          <motion.div
            className="flex flex-col gap-6"
            variants={{
              hidden: {
                opacity: 0,
                x: 50,
              },
              show: {
                opacity: 1,
                x: 0,
              },
            }}
            transition={{
              duration: 0.6,
            }}
          >
            {/* ================= CONTACT INFO ================= */}
            <motion.div
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
              whileHover={{
                y: -4,
                boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
              }}
              transition={{ duration: 0.25 }}
            >
              {/* Email */}
              <div className="flex items-center gap-4">
                <motion.div
                  className="
                    flex h-14 w-14 shrink-0 items-center justify-center
                    rounded-2xl bg-gold/15 text-gold
                  "
                  whileHover={{
                    scale: 1.08,
                    rotate: 3,
                  }}
                >
                  <FaEnvelope className="text-xl" />
                </motion.div>

                <div>
                  <h3 className="font-alibaba text-base font-bold text-dark-blue">
                    ایمیل
                  </h3>

                  <p
                    dir="ltr"
                    className="mt-1 text-left font-iranYekan text-sm text-gray-500"
                  >
                    yamnaabhari@gmail.com
                  </p>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-100" />

              {/* Phone */}
              <div className="flex items-center gap-4">
                <motion.div
                  className="
                    flex h-14 w-14 shrink-0 items-center justify-center
                    rounded-2xl bg-dark-blue/10 text-dark-blue
                  "
                  whileHover={{
                    scale: 1.08,
                    rotate: -3,
                  }}
                >
                  <FaPhoneAlt className="text-xl" />
                </motion.div>

                <div>
                  <h3 className="font-alibaba text-base font-bold text-dark-blue">
                    تماس با ما
                  </h3>

                  <p
                    dir="ltr"
                    className="mt-1 text-left font-iranYekan text-sm text-gray-500"
                  >
                    051-33685185
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ================= QUICK SUPPORT ================= */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-dark-blue p-8 text-white shadow-sm sm:p-10"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                },
                show: {
                  opacity: 1,
                  y: 0,
                },
              }}
              whileHover={{
                y: -5,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              {/* Decorative circle */}
              <motion.div
                className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold/10"
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative flex flex-col items-center text-center">
                <motion.div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-dark-blue"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <FaHeadset className="text-2xl" />
                </motion.div>

                <h2 className="font-alibaba text-xl font-bold">
                  پشتیبانی سریع
                </h2>

                <p className="mt-3 max-w-sm font-iranYekan text-sm leading-7 text-gray-300">
                  تیم پشتیبانی سپهر املاک آماده پاسخگویی به سوالات و درخواست‌های
                  شماست.
                </p>

                <motion.div
                  className="mt-5 rounded-full border border-gold/30 bg-gold/10 px-5 py-2"
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  <span className="font-alibaba text-xs text-gold">
                    همیشه در کنار شما هستیم
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT SIDE ================= */}
          <motion.div
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
            variants={{
              hidden: {
                opacity: 0,
                x: -50,
              },
              show: {
                opacity: 1,
                x: 0,
              },
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="mb-7">
              <h2 className="font-alibaba text-xl font-bold text-dark-blue sm:text-2xl">
                پیام خود را برای ما ارسال کنید
              </h2>

              <p className="mt-2 font-iranYekan text-sm text-gray-500">
                فرم زیر را تکمیل کنید تا در اولین فرصت با شما تماس بگیریم.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-alibaba text-sm font-semibold text-dark-blue">
                    <FaUser className="text-gold" />
                    نام
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="نام خود را وارد کنید"
                    className="
                      h-14 w-full rounded-xl border border-gray-200
                      bg-white px-4 font-iranYekan text-sm text-dark-blue
                      outline-none transition
                      placeholder:text-gray-400
                      focus:border-gold focus:ring-2 focus:ring-[#cba36f]
                    "
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    dir="rtl"
                    className="mb-2 flex items-center gap-2 font-alibaba text-sm font-semibold text-dark-blue"
                  >
                    <FaEnvelope className="text-gold" />
                    ایمیل
                  </label>

                  <input
                    dir="ltr"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className="
                      h-14 w-full rounded-xl border border-gray-200
                      bg-white px-4 text-left font-iranYekan text-sm
                      text-dark-blue outline-none transition
                      placeholder:text-gray-400
                      focus:border-gold focus:ring-2 focus:ring-[#cba36f]
                    "
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-alibaba text-sm font-semibold text-dark-blue">
                  <FaPhoneAlt className="text-gold" />
                  شماره تماس
                </label>

                <input
                  dir="ltr"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="09123456789"
                  className="
                    h-14 w-full rounded-xl border border-gray-200
                    bg-white px-4 text-left font-iranYekan text-sm
                    text-dark-blue outline-none transition
                    placeholder:text-gray-400
                    focus:border-gold focus:ring-2 focus:ring-[#cba36f]
                  "
                />
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-alibaba text-sm font-semibold text-dark-blue">
                  <FaCommentAlt className="text-gold" />
                  موضوع
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="موضوع پیام خود را وارد کنید"
                  className="
                    h-14 w-full rounded-xl border border-gray-200
                    bg-white px-4 font-iranYekan text-sm text-dark-blue
                    outline-none transition
                    placeholder:text-gray-400
                    focus:border-gold focus:ring-2 focus:ring-[#cba36f]
                  "
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-alibaba text-sm font-semibold text-dark-blue">
                  <FaCommentAlt className="text-gold" />
                  پیام
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  maxLength={1500}
                  placeholder="پیام خود را برای ما بنویسید..."
                  className="
                    min-h-40 w-full resize-none rounded-xl border
                    border-gray-200 bg-white px-4 py-4
                    font-iranYekan text-sm leading-7 text-dark-blue
                    outline-none transition
                    placeholder:text-gray-400
                    focus:border-gold focus:ring-2 focus:ring-[#cba36f]
                  "
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2, scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="
                  flex h-14 w-full items-center justify-center gap-2
                  rounded-xl bg-gold font-alibaba text-sm font-bold
                  text-white shadow-sm transition-all duration-200
                  hover:opacity-90 hover:shadow-lg
                  disabled:cursor-not-allowed disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        h-5 w-5 animate-spin rounded-full
                        border-2 border-white/30 border-t-white
                      "
                    />

                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    ارسال پیام
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}