import { Navigate, Outlet } from "react-router-dom";
import DashboardSidebar from "../../Components/DashboardSidebar";
import ScrollToTop from "../../Components/ScrollToTop";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
  const { token } = useSelector((state) => state.auth);
  if (!token) {
    return <Navigate to={"/auth/login"} />;
  }
  return (
    <>
      <ScrollToTop />
      <div className="">
        <DashboardSidebar />
        <main className="min-h-screen lg:mr-64 pt-18 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}
