import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItemClass = ({ isActive }) =>
    [
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-orange text-dark" : "text-text-main hover:bg-light-gray",
    ].join(" ");

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="border-b border-border bg-dark/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-lg font-semibold tracking-wide">
                    Leet<span className="text-orange">Quest</span>
                </Link>

                <nav className="flex flex-wrap items-center gap-2">
                    {isAuthenticated && (
                        <>
                            <NavLink to="/dashboard" className={navItemClass}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/analytics" className={navItemClass}>
                                Analytics
                            </NavLink>
                            <NavLink to="/challenges" className={navItemClass}>
                                Challenges
                            </NavLink>
                            <NavLink to="/friends" className={navItemClass}>
                                Friends
                            </NavLink>
                            <NavLink to="/profile" className={navItemClass}>
                                Profile
                            </NavLink>
                            <div className="flex items-center gap-2 border-l border-border pl-2">
                                <span className="text-sm text-text-muted">
                                    {user?.username || user?.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-main hover:bg-light-gray transition-colors"
                                >
                                    Log out
                                </button>
                            </div>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link
                                to="/login"
                                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-main hover:bg-light-gray"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full border border-orange px-4 py-2 text-sm font-medium text-orange hover:bg-orange hover:text-dark"
                            >
                                Create account
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
