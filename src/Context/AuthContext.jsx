import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ==========================
  // GET CURRENT USER
  // ==========================

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v0.0.24/user/me`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Invalid token");
      }

      const data = await response.json();

      setUser(data);
    } catch (error) {
      console.log(error);

      localStorage.removeItem("access_token");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UPDATE USER
  // ==========================

  const updateCurrentUser = async (updatedData) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v0.0.24/user/update_profile`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // update global auth state
      setUser(data);

      return data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  // ==========================
  // LOGOUT
  // ==========================

  const logout = () => {
    localStorage.removeItem("access_token");

    setUser(null);
  };

  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  // ==========================
  // CHANGE PASSWORD
  // ==========================

  const changePassword = async (passwordData) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v0.0.24/user/update_password/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(passwordData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update password");
      }

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchCurrentUser,
        updateCurrentUser,changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
