import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../api/authservice";

const AuthContextProvider = createContext();

export const useAuth = () => {
    const context = useContext(AuthContextProvider);

    if (!context) {
        throw new Error('useAuth must be used within AuthContext');
    }

    return context;
}

function AuthContext({ children }) {

    const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState();

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
            // optionally decode token or request /me to get user info
            setUser(user); // placeholder if you want to show user details
        } else {
            setAuthToken(null);
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token])

    const login = (token, userData = null) => {
        localStorage.setItem('authToken', token);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
            setIsAuthenticated(true);
            setUser(userData);
        }
        setToken(token);
    }

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
    }

    const updateUser = (updatedUserData) => {
        const updatedUser = { ...user, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }

    return (
        <AuthContextProvider.Provider value={{ isAuthenticated, token, user, login, logout, updateUser, loading, setLoading }}>
            {children}
        </AuthContextProvider.Provider>
    )
}


export default AuthContext;


