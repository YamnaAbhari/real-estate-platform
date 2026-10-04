import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp } from "react-icons/io5";
import FetchData from "../../../../../Utils/FetchData";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import notify from "../../../../../Utils/Notify";
import { socket } from "../../../../../Utils/socket";
import DeleteMessage from "./DeleteMessages";

export default function Messages() {
  const [messageInp, setMessagesInp] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const [deleteMenuPosition, setDeleteMenuPosition] = useState({
    left: 0,
    top: 0,
  });
  const chatBoxRef = useRef(null);

  // ================== DELETE UI ==================
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ================== DOTS VISIBILITY (click-to-show) ==================
  const [activeMessageId, setActiveMessageId] = useState(null);

  const { chatId } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const messageEndRef = useRef(null);

  // ================== DETECT MOBILE =====================
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const handleMediaChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleMediaChange();

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // ================== CLOSE ACTIVE DOTS ON OUTSIDE CLICK =====================
  useEffect(() => {
    const handleClickOutsideMessage = (e) => {
      if (!e.target.closest(".message-click-area")) {
        setActiveMessageId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMessage);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMessage);
    };
  }, []);

  // ================== SOCKET =====================
  useEffect(() => {
    //================ RECEIVE MESSAGE =============
    if(!token)return
    if (!chatId) return;

    const handleReceiveMessage = (message) => {
      if (message.chatId?.toString() !== chatId?.toString()) {
        return;
      }

      setMessages((prev) => [...prev, message]);

      if (message.senderId?._id?.toString() !== user?._id?.toString()) {
        FetchData(`chats/${chatId}/messages/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    };

    //=============== MARK MESSAGE AS READ ==========
    const handleMessagesRead = ({ chatId: readChatId }) => {
      if (readChatId !== chatId) return;

      setMessages((prevMessages) =>
        prevMessages.map((message) => ({
          ...message,
          isRead: true,
        })),
      );
    };

    //=============== DELETE MESSAGE =================
    const handleDeleteMessage = ({ chatId: deletedChatId, messageId }) => {
      if (chatId.toString() !== deletedChatId.toString()) return;

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId),
      );
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("deletedMessage", handleDeleteMessage);

    socket.emit("joinChat", chatId);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("deletedMessage", handleDeleteMessage);
    };
  }, [chatId, user?._id, token]);

  // ================== SEND MESSAGE =====================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInp.trim()) return;

    try {
      setSending(true);

      const result = await FetchData(`chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: messageInp.trim(),
        }),
      });

      if (!result.success) {
        notify("error", "خطا در ارسال پیام");
        return;
      }

      setMessagesInp("");
    } catch (error) {
      notify("error", error.message || "خطا در ارسال پیام");
    } finally {
      setSending(false);
    }
  };

  // ================== GET MESSAGES =====================
  useEffect(() => {
    if (!chatId) return;

    const getMessages = async () => {
      setMessages([]);
      setSending(true);

      try {
        const result = await FetchData(`chats/${chatId}/messages?limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!result.success) {
          notify("error", "دریافت پیام‌ها با خطا مواجه شد");
          return;
        }

        setMessages(result.data || []);

        //================== READ MESSAGE ================
        await FetchData(`chats/${chatId}/messages/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        notify("error", error.message || "دریافت پیام‌ها با خطا مواجه شد");
      } finally {
        setSending(false);
      }
    };

    getMessages();
  }, [chatId, token]);

  // ================== SCROLL IN THE END OF THE MESSAGES ================
  useEffect(() => {
    if (messages.length > 0) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  console.log(messages);

  //================ HANDLE DELETE MESSAGE ===============
  const handleDeleteMessage = (e, message, isMyMessage) => {
    if (!isMyMessage) return;

    if (isMobile) {
      setSelectedMessage(message);
      setShowDeleteOption(true);

      const rect = e.currentTarget.getBoundingClientRect();
      const chatRect = chatBoxRef.current.getBoundingClientRect();

      const menuWidth = 160;
      const gap = 8;

      let left = rect.left + 50;

      const minLeft = chatRect.left + gap;
      const maxLeft = chatRect.right - menuWidth - gap;

      if (left < minLeft) {
        left = minLeft;
      }

      if (left > maxLeft) {
        left = maxLeft;
      }

      setDeleteMenuPosition({
        left,
        top: rect.bottom + gap,
      });
    } else {
      setActiveMessageId((prev) => (prev === message._id ? null : message._id));
    }
  };

  return (
    <div className="h-[calc(100vh-172px)] min-w-0  overflow-y-auto overflow-x-hidden">
      {/* ================== MESSAGES ================== */}
      <div ref={chatBoxRef} className="w-full  mb-21 px-4 py-4">
        {messages.map((message) => {
          const isMyMessage =
            message.senderId?._id?.toString() === user?._id?.toString();

          return (
            <div
              key={message._id}
              className={`relative flex w-full mb-3 ${
                isMyMessage ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`message-click-area group relative w-full flex items-center gap-2 min-w-0 ${isMyMessage ? "" : "flex-row-reverse"}`}
              >
                {/* ================= MESSAGE BOX ================== */}
                <div
                  onClick={(e) => handleDeleteMessage(e, message, isMyMessage)}
                  className={`lg:max-w-[500px] sm:max-w-[50%] max-w-[70%] px-4 py-2 rounded-2xl shadow-sm  overflow-hidden ${
                    isMyMessage
                      ? "bg-gray-100 text-gray-800 rounded-br-sm"
                      : "bg-[#cba36f] text-white rounded-bl-sm"
                  } ${isMyMessage ? "cursor-pointer" : ""}`}
                >
                  <p className="text-sm leading-6 wrap-anywhere">
                    {message.text}
                  </p>

                  {message.propertyId && (
                    <div className="mt-3 -mx-2 sm:mx-0">
                      <div className="relative overflow-hidden rounded-xl shadow-md ring-1 ring-black/5 group/img">
                        <img
                          src={
                            import.meta.env.VITE_BASE_FILE +
                            message.propertyId.images[0]
                          }
                          alt={message.propertyId.title || "property"}
                          loading="lazy"
                          className=" h-50 w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                        />

                      </div>
                    </div>
                  )}

                  <div className="flex gap-1">
                    {isMyMessage &&
                      !message.propertyId &&
                      (message.isRead ? (
                        <IoCheckmarkDoneSharp className="text-gold" />
                      ) : (
                        <IoCheckmarkSharp className="text-gold" />
                      ))}

                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isMyMessage ? "text-dark-blue" : "text-white"
                      }`}
                    >
                      {message.createdAt &&
                        new Date(message.createdAt).toLocaleTimeString(
                          "fa-IR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                    </span>
                  </div>
                </div>

                {/* ================== DELETE MESSAGE ================== */}
                {isMyMessage && (
                  <DeleteMessage
                    message={message}
                    isMyMessage={isMyMessage}
                    isMobile={isMobile}
                    showDeleteOption={
                      showDeleteOption && selectedMessage?._id === message._id
                    }
                    setShowDeleteOption={setShowDeleteOption}
                    selectedMessage={selectedMessage}
                    setSelectedMessage={setSelectedMessage}
                    menuPosition={deleteMenuPosition}
                    setMenuPosition={setDeleteMenuPosition}
                    forceShowDots={activeMessageId === message._id}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef}></div>
      </div>

      {/* ================== SENDING BOX ================== */}
      {chatId && (
        <div className="absolute bottom-0 right-0 w-full bg-white border-t border-gray-200 p-4">
          <form
            className="flex items-center gap-3"
            onSubmit={handleSendMessage}
          >
            {/* Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="پیامتان را بنویسید..."
                value={messageInp}
                onChange={(e) => setMessagesInp(e.target.value)}
                className="
                  w-full
                  h-12
                  rounded-2xl
                  focus:ring
                  focus:ring-[#cba36f]
                  ring
                  ring-[#cba36f7d]
                  bg-gray-50
                  px-4
                  text-sm
                  text-dark-blue
                  outline-none
                  transition
                  focus:border-gold
                  focus:bg-[#cba36f26]
                  placeholder:text-gray-400
                "
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending}
              className="
                h-12
                w-12
                shrink-0
                rounded-2xl
                bg-dark-blue
                text-white
                flex
                items-center
                justify-center
                cursor-pointer
                transition-all
                hover:bg-[#1a234b]
                active:scale-95
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <IoMdSend className="rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
