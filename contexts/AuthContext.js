import { createContext, useContext, useEffect, useState } from "react";
import { parseJwt } from "utils/jwt";
import { protectedRoutes } from "data/protectedRoutes";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = parseJwt(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        // 토큰이 만료됐을 경우
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser({
          id: decoded.email,
          role: decoded.role || "user",
          ...decoded,
        });
      }
    } catch (error) {
      console.error("토큰 파싱 오류:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isProtected = protectedRoutes.includes(router.pathname);
    if (!loading && !user && isProtected) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = parseJwt(token);
    setUser({
      id: decoded.email,
      role: decoded.role || "user",
      ...decoded,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isProtected = protectedRoutes.includes(router.pathname);
  if (loading || (isProtected && !user)) return null;

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
