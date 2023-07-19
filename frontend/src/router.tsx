import { createBrowserRouter } from "react-router-dom";
import { Dashboard, ErrorPage, Login, Signup } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
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
