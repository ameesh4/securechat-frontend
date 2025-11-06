import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../../securechat/src/store/userStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
}
