
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ScrollToTop from "../Components/ScrollToTop";


export default function Layout() {
  return (
    <>
    <ScrollToTop />
      <Navbar />
      <main className="min-h-svh ">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}