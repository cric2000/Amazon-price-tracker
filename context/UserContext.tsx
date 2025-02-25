"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // Import useSearchParams
import { getCurrentUser } from "@/app/action";

interface User {
  id: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pathname = usePathname(); 
  const searchParams = useSearchParams(); // Track query params

  async function fetchUser() {
    setLoading(true);
    setError(false);
    try {
      const fetchedUser = await getCurrentUser();
      console.log("Fetched User:", fetchedUser); // Debugging console log
      if (fetchedUser) {
        setUser(fetchedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Pathname Changed:", pathname);
    console.log("Search Params Changed:", searchParams.toString()); // Debugging query params
    fetchUser();
  }, [pathname, searchParams]); // Add searchParams dependency

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
