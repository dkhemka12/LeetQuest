import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { resetPassword } from "../services/authApi";
import { FiArrowLeft } from "react-icons/fi";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { resetToken } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!resetToken) {
            navigate("/login", { replace: true });
        }
    }, [resetToken, navigate]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError("");
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.trim()) {
            setError("Please enter a new password");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(resetToken, password);
            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to reset password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-12">
            <div className="w-full rounded-3xl border border-border bg-dark-gray p-8 shadow-2xl">
                <PageHeader
                    eyebrow="Create New Password"
                    title="Reset Your Password"
                    description="Enter your new password below. Make sure it's strong and secure."
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

                    {/* New Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={loading}
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50 focus:border-lc-purple focus:ring-2 focus:ring-lc-purple/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-text-secondary hover:text-text-main transition-colors"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-text-secondary">
                            Minimum 6 characters
                        </p>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                disabled={loading}
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50 focus:border-lc-purple focus:ring-2 focus:ring-lc-purple/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-text-secondary hover:text-text-main transition-colors"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !password || !confirmPassword}
                        className="w-full rounded-xl bg-lc-purple px-4 py-3 font-semibold text-white transition-all disabled:opacity-50 hover:enabled:bg-lc-purple/90 active:enabled:scale-95"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
