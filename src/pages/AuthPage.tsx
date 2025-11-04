import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { MessageSquare, Mail, Lock, User } from "lucide-react";
import { useUserStore } from "../store/userStore";
import React from "react";
import { login, signup } from "../utils/API";
import { toast } from "sonner";

export function AuthPage() {
  const navigate = useNavigate();
  // const login = useUserStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const { user, setUser } = useUserStore((state) => state);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response.token) {
        sessionStorage.setItem("token", response.token);
        localStorage.setItem("token", response.token);
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.is_admin ? "admin" : "user",
        });
        navigate("/chat");
      } else {
        toast("Invalid credentials.", {
          description: "Please check your email and password.",
        });
      }
    } catch (error) {
      toast("An unexpected error occurred.", {
        description: (error as Error).message,
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signup({ email, password });
      if (response) {
        toast("Signup successful", {
          description: "You can now login to your account.",
        });
        navigate("/login");
      }
    } catch (error) {
      toast("An unexpected error occurred.", {
        description: (error as Error).message,
      });
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password reset link sent to ${resetEmail}`);
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">ChatApp</h1>
          <p className="text-gray-600">Connect with your team instantly</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reset")}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Demo: Use any email (try "admin@example.com" for admin
                    access)
                  </p>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to get started
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="reset">
            <Card>
              <CardHeader>
                <CardTitle>Reset password</CardTitle>
                <CardDescription>
                  Enter your email to receive a reset link
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordReset}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="name@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Back to login
                  </button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
