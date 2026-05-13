import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import { registerUser, loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = ({ mode = "login" }) => {
    const isRegister = mode === "register";
    const navigate = useNavigate();
    const { login } = useAuth();
    const formRef = useRef(null);
    const inputsRef = useRef([]);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Disable complex entrance animations - just use simple fade in via CSS
    }, []);

    const handleInputFocus = (e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 161, 22, 0.8)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 161, 22, 0.2)';
    };

    const handleInputBlur = (e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = '0 0 0px rgba(255, 161, 22, 0)';
    };

    const handleButtonHover = (e) => {
        // CSS hover class handles the scale animation
    };

    const handleButtonHoverOut = (e) => {
        // CSS hover class handles the scale animation
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(""); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            let response;

            if (isRegister) {
                // Validate all fields for register
                if (!formData.username || !formData.email || !formData.password) {
                    setError("All fields are required");
                    setLoading(false);
                    return;
                }

                response = await registerUser({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                });
            } else {
                // Validate email and password for login
                if (!formData.email || !formData.password) {
                    setError("Email and password are required");
                    setLoading(false);
                    return;
                }

                response = await loginUser({
                    email: formData.email,
                    password: formData.password,
                });
            }

            const responseData = response.data;
            const { token, ...userData } = responseData;

            // Store token in localStorage and update auth context
            localStorage.setItem("authToken", token);
            login({ ...userData, token });

            // Redirect to dashboard
            setTimeout(() => navigate("/dashboard"), 300);
        } catch (err) {
            const message = err.response?.data?.message || err.message || "An error occurred";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (credentials) => {
        setFormData((prev) => ({
            ...prev,
            ...credentials,
        }));
        setError("");
    };

    return (
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center px-4 py-12">
            <div className="w-full rounded-3xl border border-border bg-dark-gray p-8 shadow-2xl">
                <PageHeader
                    eyebrow={isRegister ? "Create account" : "Welcome back"}
                    title={isRegister ? "Join LeetQuest" : "Log in to LeetQuest"}
                    description={
                        isRegister
                            ? "Start tracking streaks, XP, and progress."
                            : "Continue your gamified LeetCode journey."
                    }
                />

                <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {isRegister && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            disabled={loading}
                            ref={(el) => (inputsRef.current[0] = el)}
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none disabled:opacity-50 transition-all"
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        disabled={loading}
                        ref={(el) => (inputsRef.current[isRegister ? 1 : 0] = el)}
                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none disabled:opacity-50 transition-all"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        disabled={loading}
                        ref={(el) => (inputsRef.current[isRegister ? 2 : 1] = el)}
                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none disabled:opacity-50 transition-all"
                    />

                    {error && (
                        <div className="rounded-xl bg-red-500 bg-opacity-10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonHoverOut}
                        className="w-full rounded-xl bg-orange px-4 py-3 font-semibold text-dark hover:bg-orange-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {loading
                            ? "Loading..."
                            : isRegister
                                ? "Create account"
                                : "Log in"}
                    </button>

                    {/* Quick Login Buttons for Development */}
                    <div className="mt-6 space-y-3 border-t border-border pt-6">
                        <p className="text-xs text-text-muted">💡 Dev Shortcuts:</p>
                        <button
                            type="button"
                            onClick={() => {
                                handleQuickLogin({
                                    username: "admin",
                                    email: "admin@leetquest.com",
                                    password: "admin123",
                                });
                            }}
                            className="w-full rounded-xl border border-orange bg-transparent px-4 py-2 text-sm font-medium text-orange hover:bg-orange/10 transition-all"
                        >
                            Login as Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleQuickLogin({
                                    username: "testuser",
                                    email: "test@leetquest.com",
                                    password: "test123",
                                });
                            }}
                            className="w-full rounded-xl border border-green bg-transparent px-4 py-2 text-sm font-medium text-green hover:bg-green/10 transition-all"
                        >
                            Login as Test User
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-sm text-text-muted">
                    {isRegister ? "Already have an account?" : "Need an account?"}{" "}
                    <Link to={isRegister ? "/login" : "/register"} className="text-orange hover:underline">
                        {isRegister ? "Log in" : "Register"}
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
