import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Interface for authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage auth state and provide context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null); // Store userId
  const [loading, setLoading] = useState<boolean>(true);

  // Checking if the user is authenticated on initial load from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  // Login function to set authentication state, store token and userId in localStorage
  const login = (token: string, userId: string) => {
    setIsAuthenticated(true);
    setUserId(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId); // Store userId
  };

  // Logout function to reset authentication state, and remove token and userId from localStorage
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  // While loading on initial mount, prevent rendering other components
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
