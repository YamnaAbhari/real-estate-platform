import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import ScrollToTop from "../../Components/ScrollToTop";


export default function ContactLayout() {
  return (
      <>
       <ScrollToTop />
         <Navbar />
         <main className="min-h-svh ">
           <Outlet />
         </main>
       </>
  )
}
