import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import FetchData from "../../../../Utils/FetchData";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { socket } from "../../../../Utils/socket";

export default function ChatList() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await FetchData("chats?sort=createdAt", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (result.success) setChats(result.data || []);
        // console.log(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, location.state?.refresh]);

  const getOtherUser = (chat) =>
    chat.buyerId?._id.toString() === user?._id.toString()
      ? chat.sellerId
      : chat.buyerId;

  const handleSelect = (chat) => {
    setSelectedId(chat._id);
    navigate(`/chat/${chat._id}`);
  };

  useEffect(() => {
    //// =============== RECEIVE NEW MESSAGE REAL TIME =============
    const handleNewMessage = (message) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat._id !== message.chatId) {
            return chat;
          }

          const isMyMessage =
            message.senderId?._id?.toString() === user?._id?.toString();

          return {
            ...chat,
            lastMessage: message.text,
            lastMessageAt: message.createdAt,
            unreadCount: isMyMessage
              ? chat.unreadCount
              : (chat.unreadCount || 0) + 1,
          };
        }),
      );
    };

    // =============== RECEIVE LAST MESSAGE REAL TIME ===============
    const handleMessagesRead = ({ chatId }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, unreadCount: 0 } : chat,
        ),
      );
    };

    const handleLastMessageAfterDeletedMessage = ({ chatId,lastMessage,lastMessageAt }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage,
                lastMessageAt
              }
            : chat,
        ),
      );
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("deletedMessage", handleLastMessageAfterDeletedMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("deletedMessage", handleLastMessageAfterDeletedMessage);
    };
  }, [user?._id]);

  useEffect(() => {
    chats.forEach((chat) => {
      socket.emit("joinChat", chat._id);
    });
  }, [chats]);

  if (loading) {
    return (
      <div className="flex h-full w-full flex-col bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-bold text-[#0e1431]">گفتگوها</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-153px)] pb-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4  ">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visibleChats = chats.filter((chat) => chat.lastMessage !== "");

  return (
    <div className="flex h-full w-full flex-col bg-white font-iranYekan border-l border-gray-200">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 bg-white/80 px-5 py-4 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-[#0e143193]">گفتگوها</h2>
      </div>

      {/* Chat list */}
      {visibleChats.length === 0 ? (
        <div className="flex h-75 flex-col items-center justify-center gap-3 px-5 text-center">
          <HiOutlineChatAlt2 className="text-4xl text-gold" />

          <p className="text-sm text-gold">هنوز گفتگویی ندارید</p>
        </div>
      ) : (
        <div className="overflow-y-auto h-[calc(100vh-153px)] pb-5 ">
          {visibleChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const isSelected = selectedId === chat._id;

            return (
              <button
                key={chat._id}
                onClick={() => handleSelect(chat)}
                className={`flex w-full items-center gap-3 border-l-4 px-5 py-4 text-right transition-colors cursor-pointer ${
                  isSelected
                    ? "border-[#cba36f] bg-[#faf7f2]"
                    : "border-transparent hover:bg-[#faf7f2]/40"
                }`}
              >
                {/* Profile */}
                <div className="relative h-12 w-12 shrink-0">
                  {otherUser?.profilePic ? (
                    <img
                      src={import.meta.env.VITE_BASE_FILE+otherUser.profilePic}
                      alt={otherUser.name}
                      className="h-full w-full rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#0e1431] to-[#2b3568] text-lg font-bold text-white shadow-sm">
                      {otherUser?.name?.charAt(0) || "؟"}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold text-[#0e1431]">
                      {otherUser?.name || "کاربر"}
                    </h3>

                    {chat.lastMessageAt && (
                      <span className="shrink-0 whitespace-nowrap text-xs text-gray-400">
                        {new Date(chat.lastMessageAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <p className="truncate text-sm text-gray-500">
                      {chat.lastMessage || "هنوز پیامی ارسال نشده"}
                    </p>

                    {chat.unreadCount > 0 && (
                      <span className="flex  h-5 w-8 items-center justify-center rounded-full bg-[#cba36f] pt-0.5 text-[12px] font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
