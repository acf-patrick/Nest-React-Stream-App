import { createBrowserRouter } from "react-router-dom";
import { Dashboard, ErrorPage, Login, Signup } from "./pages";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import {
  EnterEmail,
  ResetPassword,
  SetNewPassword,
} from "./pages/forgot-password/components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    children: [
      {
        path: "",
        element: <EnterEmail />,
      },
      {
        path: "2",
        element: <ResetPassword />,
      },
      {
        path: "3",
        element: <SetNewPassword />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

export default router;
