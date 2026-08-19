import { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  async function login(nationalId, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nationalId, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "رقم الهوية أو كلمة المرور غير صحيحة");
    }

    const data = await response.json();
    const user = {
      id: data.userId,
      nameAr: data.fullNameAr,
      role: data.roleName,
    };

    setCurrentUser(user);
    setToken(data.token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("token", data.token);

    return user;
  }

  function logout() {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  }

  const value = {
    currentUser,
    token,
    login,
    logout,
    isAuthenticated: !!currentUser && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth يجب أن يُستخدم داخل AuthProvider");
  return ctx;
}