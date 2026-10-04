
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../../Components/ScrollToTop";

export default function UnProtected() {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  if (token) {
    return (
      <Navigate
        to={location.state?.redirectTo || "/"}
        state={{
          previousPage: location.state?.previousPage,
        }}
        replace
      />
    );
   
  }
  return (
    <>
    <ScrollToTop />
      <Outlet />
    </>
  );
}