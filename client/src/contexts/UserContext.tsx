import { useState, useEffect, createContext, useContext, useCallback } from "react";
import axios from "axios";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
  fetchUserDetails: (token: string) => Promise<void>;
  isAuthenticated: boolean;
  hasToken: boolean; // Add this to track if token exists
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: () => {},
  isAuthenticated: false,
  fetchUserDetails: () => Promise.resolve(),
  hasToken: false, // Add default value
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false); // Add state to track token

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setHasToken(false); // Update token state
  }, []);

  // Fetch user details from the server when the component mounts
  const fetchUserDetails = async (token: string) => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/details`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        setHasToken(false); // Update token state
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
      localStorage.removeItem("token");
      setHasToken(false); // Update token state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setHasToken(false); // No token exists
      setIsLoading(false);
      return;
    }

    setHasToken(true); // Token exists
    fetchUserDetails(token);
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    logout,
    fetchUserDetails,
    isAuthenticated: !!user,
    hasToken, // Expose the token status
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for easier context consumption
export const useUser = () => useContext(UserContext);

export default UserContext;
