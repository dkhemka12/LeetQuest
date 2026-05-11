import React, { createContext, useContext, useState } from "react";

const STORAGE_KEY = "leetquest-user";

const AuthContext = createContext(null);

const readStoredUser = () => {
    if (typeof window === "undefined") {
        return null;
    }

    const storedUser = window.localStorage.getItem(STORAGE_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => readStoredUser());

    const login = (nextUser) => {
        setUser(nextUser);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    };

    const logout = () => {
        setUser(null);
        window.localStorage.removeItem(STORAGE_KEY);
    };

    const value = {
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
