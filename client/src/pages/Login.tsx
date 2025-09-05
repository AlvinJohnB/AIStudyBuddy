import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  interface LoginFormData {
    username: string;
    password: string;
  }

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        formData
      );
      if (response.status === 200) {
        toast.success("Login successful!");
        setFormData({ username: "", password: "" });
        localStorage.setItem("token", response.data.access);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white mx-auto mb-4">
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Study Buddy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back to your learning journey
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your study materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="pl-10"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end text-sm">
                {/* <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label> */}
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full" size="lg">
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="text-center mt-6 text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
