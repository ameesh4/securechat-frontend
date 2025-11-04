import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import React from "react";

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
