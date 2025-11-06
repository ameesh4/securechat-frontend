import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthPage } from "../../securechat/src/pages/AuthPage";
import { ChatPage } from "../../securechat/src/pages/ChatPage";
import { AdminPage } from "../../securechat/src/pages/AdminPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useUserStore } from "../../securechat/src/store/userStore";
import { validateToken } from "../../securechat/src/utils/API";
import { initSocket } from "../../securechat/src/utils/Socket";

function AppRoutes() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const authenticateUser = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const response = await validateToken();
        setUser({
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.is_admin ? "admin" : "user",
        });
        navigate("/chat");
      }
    } catch (error) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    const socket = initSocket();

    socket.on("welcome", (msg) => console.log("👋", msg));

    socket.on("message", (data) => {
      console.log("📩 Received:", data);
      // You could dispatch this to Redux/store
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/chat"} replace />
          ) : (
            <AuthPage />
          )
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
