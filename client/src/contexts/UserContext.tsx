import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
};

const UserContext = createContext<{ user: User | null; setUser: (user: User | null) => void }>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user details from the server when the component mounts
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
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
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
      }
    };

    fetchUserDetails();
  }, []);

  return user === null ? (
    <Navigate to="/login" replace />
  ) : (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};

export default UserContext;
