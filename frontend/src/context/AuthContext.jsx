import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const MOCK_USER = {
  id: 12,
  nameAr: "سارة عبدالله القحطاني",
  role: "CommStaff",
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(MOCK_USER);

  const value = {
    currentUser,
    setCurrentUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth يجب أن يُستخدم داخل AuthProvider");
  return ctx;
}