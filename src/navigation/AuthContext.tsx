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
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage auth state and provide context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Checking if the user is authenticated on initial load from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Login function to set authentication state and store token in localStorage
  const login = (token: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
  };

  // Logout function to reset authentication state and remove token from localStorage
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  // While loading on initial mount, prevent rendering other components
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
