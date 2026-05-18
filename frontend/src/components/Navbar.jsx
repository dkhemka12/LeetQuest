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
    const displayName = user?.firstName ? `Hi, ${user.firstName}` : user?.username || user?.email;

    const handleLogoClick = (e) => {
        if (isAuthenticated) {
            e.preventDefault();
            navigate("/dashboard");
        }
    };

    const logoTo = isAuthenticated ? "/" : "/";

    return (
        <header className="border-b border-border bg-dark/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to={logoTo} onClick={handleLogoClick} className="text-lg font-semibold tracking-wide">
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
                            <NavLink to="/history" className={navItemClass}>
                                History
                            </NavLink>
                            <NavLink to="/challenges" className={navItemClass}>
                                Challenges
                            </NavLink>
                            <NavLink to="/friends" className={navItemClass}>
                                Friends
                            </NavLink>
                            <NavLink to="/clans" className={navItemClass}>
                                Clans
                            </NavLink>
                            <NavLink to="/profile" className={navItemClass}>
                                Profile
                            </NavLink>
                            {user?.isAdmin && (
                                <NavLink to="/admin/users" className={navItemClass}>
                                    Users
                                </NavLink>
                            )}
                            <div className="flex items-center gap-2 border-l border-border pl-2">
                                <span className="text-sm text-text-muted">
                                    {displayName}
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
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
