import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthGuard from "./AuthGuard";

import App from "../App";
import Login from "../views/Login";
import Home from "../views/Home";
import About from "../views/About";

export default createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard requiresAuth={true}>
            <Home />
          </AuthGuard>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthGuard requiresAuth={false}>
            <Login />
          </AuthGuard>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);
