import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Mail, Lock, User, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();

  interface RegisterFormData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    school: string;
  }

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, formData);
      if (response.status === 201) {
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          school: "",
        });
        toast.success("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occurred during registration.");
        console.error("Registration error:", error.response);
      } else {
        console.error("Registration failed:", error);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Study Buddy</h1>
          <p className="text-gray-600 dark:text-gray-400">Start your smart learning journey today</p>
        </div>
        <form onSubmit={submitForm}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create Account</CardTitle>
              <CardDescription>Join thousands of students enhancing their learning with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className="pl-10"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    className="pl-10"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
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
                    placeholder="Create a strong password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School:</Label>
                <div className="relative">
                  <School className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="school"
                    type="text"
                    placeholder="Enter your school name"
                    className="pl-10"
                    value={formData.school}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="rounded mt-1" required />
                <span className="text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="text-center mt-6 text-xs text-gray-500">
          By creating an account, you're joining a community of learners using AI to study smarter
        </div>
      </div>
    </div>
  );
}
