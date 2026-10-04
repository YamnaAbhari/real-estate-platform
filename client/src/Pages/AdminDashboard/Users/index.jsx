import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import {
  FaSearch,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaUserShield,
  FaBan,
  FaCheckCircle,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import StyledSelect from "../../../Components/StyledSelect";

export default function Users() {
  const { token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // ================= FILTERS =================

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // ================= PAGINATION =================

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // =========================================================
  // GET USERS
  // =========================================================

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", 10);

        // filter by role
        if (role) {
          params.set("role", role);
        }

        // filter by blocked status
        if (status === "blocked") {
          params.set("isBlocked", "true");
        }

        if (status === "active") {
          params.set("isBlocked", "false");
        }

        const result = await FetchData(
          `users?&q=${search}&${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!result.success) {
          notify("error", result.message || "دریافت کاربران انجام نشد");

          return;
        }

        setUsers(result.data || []);

        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
        }
      } catch (error) {
        console.log("GET USERS ERROR:", error);

        notify("error", "خطا در دریافت کاربران");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getUsers();
    }
  }, [token, search, role, status, page]);

  // =========================================================
  // BLOCK / UNBLOCK USER
  // =========================================================

  const handleBlockUser = async (user) => {
    try {
      setActionLoading(user._id);

      const result = await FetchData(`users/${user._id}/block`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.success) {
        notify("error", result.message || "تغییر وضعیت کاربر انجام نشد");

        return;
      }

      notify("success", result.message || "وضعیت کاربر با موفقیت تغییر کرد");

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? {
                ...item,
                isBlocked: result.data?.isBlocked,
              }
            : item,
        ),
      );
    } catch (error) {
      console.log("BLOCK USER ERROR:", error);

      notify("error", "خطا در تغییر وضعیت کاربر");
    } finally {
      setActionLoading(null);
    }
  };

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `آیا از حذف کاربر «${user.name || "این کاربر"}» مطمئن هستید؟`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);

      const result = await FetchData(`users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.success) {
        notify("error", result.message || "حذف کاربر انجام نشد");

        return;
      }

      notify("success", result.message || "کاربر با موفقیت حذف شد");

      // حذف کاربر از UI بدون درخواست دوباره
      setUsers((prev) => prev.filter((item) => item._id !== user._id));
    } catch (error) {
      console.log("DELETE USER ERROR:", error);

      notify("error", "خطا در حذف کاربر");
    } finally {
      setActionLoading(null);
    }
  };

  // role option for select box
  const roleOptions = [
    { value: "", label: " همه نقش‌ها" },
    { value: "admin", label: " مدیران" },
    { value: "seller", label: " فروشندگان" },
    { value: "buyer", label: "  کاربران" },
  ];

  // status option for select box
  const statusOptions = [
    { value: "", label: " همه وضعیت‌ها" },
    { value: "active", label: " فعال" },
    { value: "blocked", label: " مسدود" },
  ];

  // =========================================================
  // ROLE NAME
  // =========================================================

  const getRoleName = (role) => {
    switch (role) {
      case "admin":
        return "مدیر";

      case "seller":
        return "فروشنده";

      case "buyer":
        return "کاربر";

      default:
        return role || "نامشخص";
    }
  };

  // =========================================================
  // ROLE STYLE
  // =========================================================

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-violet-50 text-violet-600";

      case "superAdmin":
        return "bg-purple-50 text-purple-600";

      case "seller":
        return "bg-blue-50 text-blue-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleResetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  return (
    <section dir="rtl" className="w-full sm:px-5 px-3 py-5">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">
        <h2 className="font-alibaba text-xl font-bold text-dark-blue">
          مدیریت کاربران
        </h2>

        <p className="mt-1 font-iranYekan text-sm text-gray-500">
          مشاهده، جستجو و مدیریت کاربران سامانه
        </p>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}

          <div className="relative lg:col-span-2">
            <FaSearch
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="جستجو بر اساس نام یا شماره تلفن..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                pr-11
                pl-4
                font-iranYekan
                text-sm
                text-dark-blue
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-gold
                focus:bg-white
                focus:ring-2
                focus:ring-[#cba36f]/20
              "
            />
          </div>

          {/* Role */}
          <StyledSelect
            options={roleOptions}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          />

          {/* Status */}
          <StyledSelect
            options={statusOptions}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Reset */}

        {(search || role || status) && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="
                cursor-pointer
                font-iranYekan
                text-xs
                text-gray-500
                transition
                hover:text-dark-blue
              "
            >
              حذف فیلترها
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          USERS TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="py-20 text-center">
            <p className="font-iranYekan text-sm text-gray-500">
              در حال دریافت کاربران...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <FaUser className="mx-auto mb-3 text-3xl text-gray-300" />

            <p className="font-iranYekan text-sm text-gray-500">
              کاربری پیدا نشد
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Header */}

            <div
              className="
                hidden
                grid-cols-[2fr_1.5fr_2fr_1fr_1fr_1.5fr]
                gap-4
                border-b
                border-gray-100
                bg-gray-50
                px-5
                py-4
                lg:grid
              "
            >
              <p className="font-iranYekan text-xs font-semibold text-gray-500">
                کاربر
              </p>

              <p className="font-iranYekan text-xs font-semibold text-gray-500">
                شماره تلفن
              </p>

              <p className="font-iranYekan text-xs font-semibold text-gray-500">
                ایمیل
              </p>

              <p className="font-iranYekan text-xs font-semibold text-gray-500">
                نقش
              </p>

              <p className="font-iranYekan text-xs font-semibold text-gray-500">
                وضعیت
              </p>

              <p className="font-iranYekan text-xs font-semibold text-gray-500">
                عملیات
              </p>
            </div>

            {/* Users */}

            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    px-5
                    py-5
                    transition
                    hover:bg-gray-50/70
                    lg:grid-cols-[2fr_1.5fr_2fr_1fr_1fr_1.5fr]
                    lg:items-center
                  "
                >
                  {/* User */}

                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-dark-blue/10
                        text-dark-blue
                      "
                    >
                      <FaUser />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-alibaba text-sm font-bold text-dark-blue">
                        {user.name || "بدون نام"}
                      </p>

                      <p className="mt-1 font-iranYekan text-xs text-gray-400">
                        شناسه: {user._id}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}

                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-xs text-gray-400" />

                    <span
                      dir="ltr"
                      className="font-iranYekan text-sm text-gray-600"
                    >
                      {user.phoneNumber || "-"}
                    </span>
                  </div>

                  {/* Email */}

                  <div className="flex min-w-0 items-center gap-2">
                    <FaEnvelope className="shrink-0 text-xs text-gray-400" />

                    <span
                      dir="ltr"
                      className="
                        truncate
                        font-iranYekan
                        text-sm
                        text-gray-600
                      "
                    >
                      {user.email || "ایمیل ثبت نشده"}
                    </span>
                  </div>

                  {/* Role */}

                  <div>
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-3
                        py-1.5
                        font-iranYekan
                        text-xs
                        font-medium
                        ${getRoleStyle(user.role)}
                      `}
                    >
                      <FaUserShield />

                      {getRoleName(user.role)}
                    </span>
                  </div>

                  {/* Status */}

                  <div>
                    {user.isBlocked ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-red-50
                          px-3
                          py-1.5
                          font-iranYekan
                          text-xs
                          font-medium
                          text-red-600
                        "
                      >
                        <FaBan />
                        مسدود
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-emerald-50
                          px-3
                          py-1.5
                          font-iranYekan
                          text-xs
                          font-medium
                          text-emerald-600
                        "
                      >
                        <FaCheckCircle />
                        فعال
                      </span>
                    )}
                  </div>

                  {/* Actions */}

                  <div className="flex items-center gap-2">
                    {/* Block / Unblock */}

                    <button
                      type="button"
                      disabled={actionLoading === user._id}
                      onClick={() => handleBlockUser(user)}
                      title={user.isBlocked ? "رفع مسدودیت" : "مسدود کردن"}
                      className={`
                        flex
                        h-9
                        w-9
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        ${
                          user.isBlocked
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                        }
                      `}
                    >
                      {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      disabled={actionLoading === user._id}
                      onClick={() => handleDeleteUser(user)}
                      title="حذف کاربر"
                      className="
                        flex
                        h-9
                        w-9
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-50
                        text-red-600
                        transition
                        hover:bg-red-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {!loading && users.length > 0 && totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-500
                transition
                hover:border-gold
                hover:text-dark-blue
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
          >
            <FaChevronRight />
          </button>

          <span className="font-iranYekan text-sm text-gray-500">
            صفحه {page} از {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="
                flex
                h-9
                w-9
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-500
                transition
                hover:border-gold
                hover:text-dark-blue
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
          >
            <FaChevronLeft />
          </button>
        </div>
      )}
    </section>
  );
}
