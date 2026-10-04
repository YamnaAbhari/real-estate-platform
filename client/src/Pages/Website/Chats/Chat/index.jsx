import { Navigate, useNavigate, useParams } from "react-router-dom";
// import ChatList from "../ChatList";
import { useEffect, useRef, useState } from "react";
import { handleResize } from "../../../../Utils/handleResize";
import FetchData from "../../../../Utils/FetchData";
import notify from "../../../../Utils/Notify";
import { useDispatch, useSelector } from "react-redux";
import { HiDotsVertical, HiOutlineChatAlt2 } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import Messages from "./Messages";
import { logout } from "../../../../Store/AuthSlice";
import ChatList from "../ChatList";

export default function Chat() {
  const { chatId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  const [chat, setChat] = useState(null);
  const [isDeleteBoxOpen, setIsDeleteBoxOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dispatch=useDispatch()

  


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsDeleteBoxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    handleResize(setIsMobileSize, 768);
  }, []);

  // ================ GET CHAT =================
  useEffect(() => {
    (async () => {
      if (!chatId||!token) return;
     
      try {
        const result = await FetchData(`chats/${chatId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (result.success) {
          setChat(result.data);
          // console.log(result.data);
        }
      } catch (error) {
        if (error.status === 401 || error.response?.status === 401) {
          dispatch(logout());           
          navigate("/auth/login", { replace: true });
          return;
        }
        notify("error", error.message || "خطا در پیدا کردن گفتگو");
        return;
      }
    })();
  }, [chatId, token,dispatch,navigate]);

  // ================ DELETE CHAT =================
  const handleDeleteChat = async () => {
    if (!chatId) return;
    try {
      const result = await FetchData(`chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!result.success) {
        notify("error", "خطا در حذف گفتگو");
        return;
      }
      navigate("/chat", { state: { refresh: Date.now() } });
      setIsDeleteBoxOpen(false);
    } catch (error) {
      notify("error", error.message || "خطا در حذف گفتگو");
      return;
    }
  };

    if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  const otherUser =
    chat?.buyerId?._id.toString() === user?._id.toString()
      ? chat?.sellerId
      : chat?.buyerId;

  return (
    <div className={`flex bg-white ${user?.role==='seller'?'pt-23':"pt-23"}`}>
      {isMobileSize ? (
        <aside className={`${chatId ? "hidden" : "block"} w-full`}>
          <ChatList />
        </aside>
      ) : (
        <aside className={`hidden md:block w-100 max-[1000px]:w-75 shrink-0`}>
          <ChatList />
        </aside>
      )}

      {/* Chat */}
      <div
        className={`min-w-0 flex-1 overflow-hidden h-[calc(100vh-92px)] relative font-iranYekan ${
          isMobileSize && !chatId ? "hidden" : "block"
        }`}
      >
        {!chatId ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6 text-gold font-iranYekan">
            <HiOutlineChatAlt2 className="text-6xl " />
            <h2 className="text-lg font-semibold ">پیام‌های شما</h2>
            <p className="text-sm  max-w-xs">
              یک گفتگو را انتخاب کنید تا شروع به چت کنید
            </p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between px-5 h-20 border-b border-gray-200 bg-white">
            <div className="flex gap-2 items-center">
              {/* profile */}
              <div className="relative h-12 w-12 shrink-0">
                {otherUser?.profilePic ? (
                  <img
                    src={import.meta.env.VITE_BASE_FILE + otherUser.profilePic}
                    alt={otherUser.name}
                    className="h-full w-full rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#0e1431] to-[#2b3568] text-lg font-bold text-white shadow-sm">
                    {otherUser?.name?.charAt(0) || "؟"}
                  </div>
                )}
              </div>

              {/* info */}
              <h3 className="truncate font-semibold text-[#0e1431]">
                {otherUser?.name || "کاربر"}
              </h3>
            </div>

            {/* icon */}
            <button className="cursor-pointer relative" ref={menuRef}>
              <HiDotsVertical
                className="text-2xl text-dark-blue"
                onClick={() => setIsDeleteBoxOpen((prev) => !prev)}
              />

              {isDeleteBoxOpen && (
                <div
                  onClick={() => handleDeleteChat()}
                  className={`absolute flex items-center justify-center -bottom-11 left-1 w-50 h-10 bg-dark-blue rounded-xl animate-menu-pop hover:border-2 hover:border-red-400 transition-all z-100`}
                >
                  <div className="flex gap-2 text-red-400">
                    <FiTrash2 className="text-lg" />
                    <span className="text-sm font-medium">حذف گفتگو</span>
                  </div>
                </div>
              )}
            </button>
          </div>
        )}

        <Messages />
      </div>
    </div>
  );
}
