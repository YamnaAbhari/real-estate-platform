/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../Layout";
import Protected from "../Layout/Protected";
import UnProtected from "../Layout/UnProtected";
import { lazy } from "react";
import WishlistLayout from "../Layout/WishlistLayout";
import ContactLayout from "../Layout/ContactLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import ChatsLayout from "../Layout/ChatsLayout";
import AddProperty from "../Pages/SellerDashboard/AddProperty";
import UpdateProperty from "../Pages/SellerDashboard/UpdateProperty";
import HomeAdminDashboard from "../Pages/AdminDashboard/Home";
import Users from "../Pages/AdminDashboard/Users";
import SellerApproval from "../Pages/AdminDashboard/SellerApproval";
import AllProperties from "../Pages/AdminDashboard/AllProperties";
import ContactsInbox from "../Pages/AdminDashboard/ContactsInbox";

const Home = lazy(() => import("../Pages/Website/Home"));
const Profile = lazy(() => import("../Pages/Website/Profile"));
const Login = lazy(() => import("../Pages/Auth/Login"));
const Register = lazy(() => import("../Pages/Auth/Register"));
const VerifyRegisterOtp = lazy(
  () => import("../Pages/Auth/Register/VerifyRegisterOtp"),
);
const ForgetPassword = lazy(() => import("../Pages/Auth/ForgetPassword"));
const VerifyForgotPasswordOtp = lazy(
  () => import("../Pages/Auth/ForgetPassword/VerifyForgotPasswordOtp"),
);
const ResetPassword = lazy(
  () => import("../Pages/Auth/ForgetPassword/ResetPassword"),
);
const NotFound = lazy(() => import("../Pages/Website/NotFound"));
const Properties = lazy(() => import("../Pages/Website/Properties"));
const PropertyDetails = lazy(() => import("../Pages/Website/propertyDetails"));
const Chat = lazy(() => import("../Pages/Website/Chats/Chat"));
const Contact = lazy(() => import("../Pages/Website/Contact"));
const Wishlist = lazy(() => import("../Pages/Website/Wishlist"));
const HomeSellerDashboard = lazy(() => import("../Pages/SellerDashboard/Home"));
const MyListings = lazy(() => import("../Pages/SellerDashboard/MyListings"));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/properties",
        element: <Properties />,
      },
      {
        path: "properties/:propertyType",
        element: <Properties />,
      },
      {
        path: "/property-details/:id/:slug",
        element: <PropertyDetails />,
      },
    ],
  },

  {
    element: <UnProtected />,
    children: [
      {
        path: "/auth",
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "register/verify",
            element: <VerifyRegisterOtp />,
          },
          {
            path: "forgot-password",
            element: <ForgetPassword />,
          },
          {
            path: "forgot-password/verify",
            element: <VerifyForgotPasswordOtp />,
          },
          {
            path: "forgot-password/reset",
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },

  {
    element: <Protected />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },

  {
    path: "/chat",
    element: <ChatsLayout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
      {
        path: ":chatId",
        element: <Chat />,
      },
    ],
  },

  {
    path: "/seller-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomeSellerDashboard />,
      },
      {
        path: "my-listings",
        element: <MyListings />,
      },
      {
        path: "add-property",
        element: <AddProperty />,
      },
      {
        path: "edit-property/:id",
        element: <UpdateProperty />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
       {
        path: "contact",
        element: <Contact />,
      }
    ],
  },

  {
    path: "/admin-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomeAdminDashboard />,
      },
        {
        path: "users",
        element: <Users />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "seller-requests",
        element: <SellerApproval />,
      },
       {
        path: "properties",
        element: <AllProperties/>,
      },
         {
        path: "contact-inbox",
        element: <ContactsInbox/>,
      },
    ],
  },

  {
    element: <WishlistLayout />,
    children: [
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
    ],
  },

  {
    element: <ContactLayout />,
    children: [
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
