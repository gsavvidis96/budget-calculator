import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/auth";

interface Props {
  children: JSX.Element;
  requiresAuth: boolean;
}

const AuthGuard = ({ children, requiresAuth }: Props) => {
  const { user } = useAuthStore();
  let location = useLocation();

  if (requiresAuth) {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    if (user) {
      return <Navigate to="/" replace />;
    }
  }

  return children!;
};

export default AuthGuard;
