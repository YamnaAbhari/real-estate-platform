


import ScrollToTop from "../../Components/ScrollToTop";
import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import { useSelector } from "react-redux";

export default function ChatLayout() {
  const { user } = useSelector((state) => state.auth);

  const showNavbar = user?.role === "buyer";

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col h-screen overflow-hidden">
        {showNavbar && (
          <div className="shrink-0">
            <Navbar />
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}

