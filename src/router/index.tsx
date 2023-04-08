import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthGuard from "./AuthGuard";

import App from "../App";
import Login from "../views/Login";
import Home from "../views/Home";

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
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);
