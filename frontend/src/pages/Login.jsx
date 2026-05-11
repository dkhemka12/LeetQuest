import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import { registerUser, loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = ({ mode = "login" }) => {
    const isRegister = mode === "register";
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

            const { token, user } = response.data;

            // Store token in localStorage and update auth context
            localStorage.setItem("authToken", token);
            login({ ...user, token });

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || err.message || "An error occurred";
            setError(message);
        } finally {
            setLoading(false);
        }
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

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {isRegister && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none disabled:opacity-50"
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none disabled:opacity-50"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none disabled:opacity-50"
                    />

                    {error && (
                        <div className="rounded-xl bg-red-500 bg-opacity-10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-orange px-4 py-3 font-semibold text-dark hover:bg-orange-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Loading..."
                            : isRegister
                                ? "Create account"
                                : "Log in"}
                    </button>
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
