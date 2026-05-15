import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { forgotPassword } from "../services/authApi";
import { FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email);
            setSuccess(
                "Password reset link has been sent to your email. Check your inbox."
            );
            setEmail("");
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-12">
            <div className="w-full rounded-3xl border border-border bg-dark-gray p-8 shadow-2xl">
                <PageHeader
                    eyebrow="Forgot Password?"
                    title="Reset Your Password"
                    description="Enter your email address and we'll send you a link to reset your password."
                />

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="rounded-lg border border-green-500 bg-green-500/10 px-4 py-3 text-green-400">
                            {success}
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50 focus:border-lc-purple focus:ring-2 focus:ring-lc-purple/20"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="w-full rounded-xl bg-lc-purple px-4 py-3 font-semibold text-white transition-all disabled:opacity-50 hover:enabled:bg-lc-purple/90 active:enabled:scale-95"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Back to Login */}
                <button
                    onClick={() => navigate("/login")}
                    className="mt-6 flex items-center gap-2 text-sm text-text-secondary hover:text-lc-purple transition-colors"
                >
                    <FiArrowLeft size={16} />
                    Back to Login
                </button>
            </div>
        </section>
    );
};

export default ForgotPassword;
