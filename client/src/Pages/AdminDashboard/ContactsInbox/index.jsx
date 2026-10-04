import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaPhone,
  FaUser,
  FaClock,
} from "react-icons/fa";
import FetchData from "../../../Utils/FetchData";

export default function ContactsInbox() {
  const { token } = useSelector((state) => state.auth);

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // =========================
  // Get all contacts
  // =========================
  useEffect(() => {
    if (!token) return;

    const getContacts = async () => {
      try {
        setLoading(true);

        const result = await FetchData("contacts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.success) {
          setContacts(result.data || []);
        }
      } catch (error) {
        console.log("GET CONTACTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, [token]);

  // =========================
  // Filters
  // =========================
  const filteredContacts = useMemo(() => {
    if (filter === "pending") {
      return contacts.filter((contact) => contact.status === "pending");
    }

    if (filter === "read") {
      return contacts.filter((contact) => contact.status === "read");
    }

    return contacts;
  }, [contacts, filter]);

  // =========================
  // Pending count
  // =========================
  const pendingCount = contacts.filter(
    (contact) => contact.status === "pending",
  ).length;

  // =========================
  // Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // =========================
  // Time
  // =========================
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // Select contact + mark as read
  // =========================
  const handleSelectContact = async (contact) => {
    // اول پیام را نمایش بده
    setSelectedContact(contact);

    // اگر قبلاً خوانده شده، درخواست اضافه نفرست
    if (contact.status === "read") {
      return;
    }

    try {
      const result = await FetchData(`contacts/${contact._id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.success) {
        // آپدیت لیست پیام‌ها
        setContacts((prev) =>
          prev.map((item) =>
            item._id === contact._id
              ? {
                  ...item,
                  status: "read",
                }
              : item,
          ),
        );

        // آپدیت پیام انتخاب‌شده
        setSelectedContact((prev) =>
          prev
            ? {
                ...prev,
                status: "read",
              }
            : prev,
        );
      }
    } catch (error) {
      console.log("MARK CONTACT AS READ ERROR:", error);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[400px] items-center justify-center font-iranYekan text-gray-500"
      >
        در حال دریافت پیام‌ها...
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f8f8] p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-alibaba text-2xl font-bold text-dark-blue">
              صندوق پیام‌ها
            </h1>

            <p className="mt-1 font-iranYekan text-sm text-gray-500">
              پیام‌های ارسال‌شده از فرم تماس سایت
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10">
            <FaEnvelope className="text-xl text-gold" />
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* All */}
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl px-5 py-2.5 font-iranYekan text-sm transition ${
            filter === "all"
              ? "bg-dark-blue text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          همه پیام‌ها
        </button>

        {/* Pending */}
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`rounded-xl px-5 py-2.5 font-iranYekan text-sm transition ${
            filter === "pending"
              ? "bg-dark-blue text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          خوانده‌نشده

          {pendingCount > 0 && (
            <span className="mr-2 rounded-full bg-gold px-2 py-0.5 text-xs text-white">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Read */}
        <button
          type="button"
          onClick={() => setFilter("read")}
          className={`rounded-xl px-5 py-2.5 font-iranYekan text-sm transition ${
            filter === "read"
              ? "bg-dark-blue text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          خوانده‌شده
        </button>
      </div>

      {/* ================= MAIN INBOX ================= */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[380px_1fr]">
        {/* ================= CONTACT LIST ================= */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* List Header */}
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-alibaba text-base font-bold text-dark-blue">
                پیام‌ها
              </h2>

              <span className="font-iranYekan text-xs text-gray-400">
                {filteredContacts.length} پیام
              </span>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[650px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">
                <FaEnvelopeOpen className="mb-4 text-4xl text-gray-300" />

                <p className="font-iranYekan text-sm text-gray-500">
                  پیامی برای نمایش وجود ندارد
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isPending = contact.status === "pending";
                const isSelected =
                  selectedContact?._id === contact._id;

                return (
                  <button
                    key={contact._id}
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className={`w-full border-b border-gray-100 p-4 text-right transition ${
                      isSelected
                        ? "bg-gold/10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                        {contact.userId?.profilePic ? (
                          <img
                            src={contact.userId.profilePic}
                            alt={contact.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-gray-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p
                            className={`truncate font-alibaba text-sm ${
                              isPending
                                ? "font-bold text-dark-blue"
                                : "font-semibold text-gray-700"
                            }`}
                          >
                            {contact.name}
                          </p>

                          {isPending && (
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold" />
                          )}
                        </div>

                        <p className="truncate font-iranYekan text-xs text-gray-500">
                          {contact.subject}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-iranYekan text-[10px] text-gray-400">
                            {formatDate(contact.createdAt)}
                          </span>

                          <span className="font-iranYekan text-[10px] text-gray-400">
                            {formatTime(contact.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ================= MESSAGE DETAILS ================= */}
        <div className="min-h-[500px] rounded-2xl bg-white shadow-sm">
          {!selectedContact ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <FaEnvelopeOpen className="text-2xl text-gray-400" />
              </div>

              <h3 className="font-alibaba text-lg font-bold text-gray-700">
                یک پیام را انتخاب کنید
              </h3>

              <p className="mt-2 max-w-sm font-iranYekan text-sm text-gray-400">
                برای مشاهده جزئیات پیام، یکی از پیام‌های سمت راست را انتخاب
                کنید.
              </p>
            </div>
          ) : (
            <div>
              {/* ================= MESSAGE HEADER ================= */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                      {selectedContact.userId?.profilePic ? (
                        <img
                          src={selectedContact.userId.profilePic}
                          alt={selectedContact.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-gray-400" />
                      )}
                    </div>

                    <div>
                      <h2 className="font-alibaba text-lg font-bold text-dark-blue">
                        {selectedContact.name}
                      </h2>

                      <div className="mt-1 flex flex-wrap gap-3 font-iranYekan text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {formatDate(selectedContact.createdAt)}
                        </span>

                        <span>
                          {formatTime(selectedContact.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`rounded-lg px-3 py-1.5 font-iranYekan text-xs ${
                      selectedContact.status === "pending"
                        ? "bg-red-50 text-red-500"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {selectedContact.status === "pending"
                      ? "خوانده‌نشده"
                      : "خوانده‌شده"}
                  </span>
                </div>
              </div>

              {/* ================= CONTACT INFO ================= */}
              <div className="grid grid-cols-1 gap-3 border-b border-gray-100 p-6 sm:grid-cols-2">
                {/* Phone */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 font-iranYekan text-xs text-gray-400">
                    شماره تماس
                  </p>

                  <div
                    dir="ltr"
                    className="flex items-center gap-2 text-right font-iranYekan text-sm text-gray-700"
                  >
                    <FaPhone className="text-gold" />

                    {selectedContact.phoneNumber}
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-1 font-iranYekan text-xs text-gray-400">
                    ایمیل
                  </p>

                  <p
                    dir="ltr"
                    className="truncate text-right font-iranYekan text-sm text-gray-700"
                  >
                    {selectedContact.email || "ثبت نشده"}
                  </p>
                </div>
              </div>

              {/* ================= SUBJECT ================= */}
              <div className="border-b border-gray-100 p-6">
                <p className="mb-2 font-iranYekan text-xs text-gray-400">
                  موضوع
                </p>

                <h3 className="font-alibaba text-base font-bold text-dark-blue">
                  {selectedContact.subject}
                </h3>
              </div>

              {/* ================= MESSAGE ================= */}
              <div className="p-6">
                <p className="mb-3 font-iranYekan text-xs text-gray-400">
                  متن پیام
                </p>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="whitespace-pre-wrap font-iranYekan text-sm leading-8 text-gray-700">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}