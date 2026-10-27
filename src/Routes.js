import { lazy,  useMemo } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
//
import NotFound from "NotFound";

const HomePage = lazy(() => import("pages/HomePage/HomePage"));
const Layout = lazy(() => import("pages/Layout/Layout"));
// const SOLayout = lazy(() => import("pages/SOModule/Layout/SOLayout"));
// const ForgetPassword = lazy(() => import("pages/FinalDesign/ForgetPassword"));
// const Notifications = lazy(() => import("pages/Notifications"));

export default function Routes() {

  const user = useSelector((store) => store.loggedInUser);
  console.log(user,"user");
  

  const allRoutes = useMemo(()=>[
    {
      path: "/",
      element: user ? <HomePage /> : <Navigate replace to={"/home"} />,
    },

    {
      path: "/*",
      element: user ? <NotFound /> : <Navigate replace to={"/home"} />,
    },
    { path: "/layout", element: user ? <Layout /> : <Navigate replace to={"/home"} /> },
    {
      path: "/home",
      element: user ? <Navigate replace to={"/layout"} /> : <HomePage />,
    },
  ],[user]);

  return useRoutes(allRoutes);
}
