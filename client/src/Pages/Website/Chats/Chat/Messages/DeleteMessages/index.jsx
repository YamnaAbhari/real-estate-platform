
import { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FetchData from "../../../../../../Utils/FetchData";
import notify from "../../../../../../Utils/Notify";

export default function DeleteMessage({
  message,
  isMyMessage,
  showDeleteOption,
  setShowDeleteOption,
  selectedMessage,
  setSelectedMessage,
  menuPosition,
  isMobile,
  forceShowDots,
}) {
  const [deleteModal, setDeleteModal] = useState(false);

  const { chatId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const handleDeleteMessage = async () => {
    try {
      const result = await FetchData(
        `chats/${chatId}/messages/${message._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!result.success) {
        notify("error", result.message || "حذف پیام با خطا مواجه شد");
        return;
      }

      notify("success", "پیام با موفقیت حذف شد");

      setDeleteModal(false);
      setShowDeleteOption(false);
    } catch (error) {
      notify("error", error.message || "خطا در حذف پیام");
    }
  };

  //close delete box by click the outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".delete-message-menu")) {
        setShowDeleteOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowDeleteOption]);

  const handleDotsClick = (e) => {
    e.stopPropagation();
    setSelectedMessage(message);
    setShowDeleteOption(true);
  };

  const closeDeleteOption = () => {
    setShowDeleteOption(false);
  };

  useEffect(()=>{
    if(deleteModal){
      setShowDeleteOption(false)
    }
  },[deleteModal])

  return (
    <>
      <div className="relative delete-message-menu">
        {isMyMessage && (
          <button
            type="button"
            onClick={handleDotsClick}
            className={`
              z-10 hidden h-8 w-8 items-center justify-center rounded-full
              bg-gray-100 text-gray-500 shadow-sm transition-all duration-200
              hover:bg-gray-200 hover:text-[#0e1431]
              lg:flex cursor-pointer
              ${
                forceShowDots
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 focus:opacity-100"
              }
            `}
          >
            <HiDotsVertical size={18} />
          </button>
        )}


        {showDeleteOption && selectedMessage?._id === message._id && (
          <div
            className={`${isMobile ? "fixed" : "absolute right-0 top-10"} z-[100] cursor-pointer`}
            style={
              isMobile
                ? {
                    left: `${menuPosition.left}px`,
                    top: `${menuPosition.top}px`,
                  }
                : undefined
            }
            onClick={closeDeleteOption}
          >
            <div
              className="w-40 rounded-xl  border-gold bg-dark-blue p-1 shadow-lg cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="
                  w-full rounded-lg px-3 py-2.5 text-right text-sm text-gold 
                  transition hover:ring hover:ring-[#cba36f] flex gap-2 cursor-pointer
                "
              >
                <FaTrash />
               <p> حذف پیام</p>
              </button>
            </div>
          </div>
        )}
      </div>

    
      {deleteModal && (
        <div
          className="
            fixed inset-0 z-[200] flex items-center justify-center
            bg-black/40 px-4 
          "
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-dark-blue p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold text-[#0e1431]">حذف پیام</h3>

            <p className="mb-6 text-sm text-white">
              آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="
                  flex-1 rounded-xl ring-2 ring-[#cba36f] py-2.5 text-white
                  text-sm transition hover:bg-[#cba36f] cursor-pointer
                "
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleDeleteMessage}
                className="
                  flex-1 rounded-xl bg-gold py-2.5 text-sm text-white
                  transition hover:bg-[#0e1431] hover:ring-2 hover:ring-[#cba36f] cursor-pointer
                "
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
