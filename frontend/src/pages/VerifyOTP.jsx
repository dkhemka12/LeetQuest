import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { verifyOTP, resendOTP } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");

    // Get email and userId from location state (passed from Register)
    useEffect(() => {
        if (location.state?.email && location.state?.userId) {
            setUserEmail(location.state.email);
            setUserId(location.state.userId);
        } else {
            navigate("/register", { replace: true });
        }
    }, [location, navigate]);

    // Cooldown timer for resend button
    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
        setError("");
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const response = await verifyOTP(userId, otp);
            const { token, ...userData } = response.data;

            // Log in the user
            localStorage.setItem("authToken", token);
            login({ ...userData, token });

            setSuccess("Email verified successfully!");
            setTimeout(() => {
                navigate("/complete-profile", {
                    replace: true
                });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoading(true);
            setError("");
            await resendOTP(userEmail);
            setSuccess("OTP resent to your email!");
            setOtp("");
            setResendCooldown(60); // 60 second cooldown
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-12">
            <div className="w-full rounded-3xl border border-border bg-dark-gray p-8 shadow-2xl">
                <PageHeader
                    eyebrow="Verify Email"
                    title="Check Your Email"
                    description="Enter the 6-digit code sent to your email to activate your account."
                />

                <form onSubmit={handleVerify} className="mt-8 space-y-4">
                    {/* Email Display with Resend */}
                    <div className="rounded-lg border border-border bg-dark px-4 py-3 flex items-center justify-between">
                        <span className="text-text-secondary text-sm">Sent to: <strong>{userEmail}</strong></span>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading || resendCooldown > 0}
                            className="text-xs text-lc-purple font-semibold hover:enabled:text-lc-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
                        </button>
                    </div>

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

                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="000000"
                            value={otp}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength="6"
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-center text-2xl font-bold tracking-widest text-text-main outline-none transition-all disabled:opacity-50 focus:border-lc-purple focus:ring-2 focus:ring-lc-purple/20"
                        />
                        <p className="mt-2 text-sm text-text-secondary">
                            Enter the 6-digit code sent to your email
                        </p>
                    </div>

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full rounded-xl bg-lc-purple px-4 py-3 font-semibold text-white transition-all disabled:opacity-50 hover:enabled:bg-lc-purple/90 active:enabled:scale-95"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    {/* Resend OTP */}
                    <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                        <p>Still no code?</p>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading || resendCooldown > 0}
                            className="text-lc-purple font-semibold hover:enabled:text-lc-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {resendCooldown > 0
                                ? `Resend in ${resendCooldown}s`
                                : "Request new code"}
                        </button>
                    </div>
                </form>

                {/* Back to Register */}
                <div className="mt-6 text-center text-sm text-text-secondary">
                    <p>
                        Wrong email?{" "}
                        <button
                            onClick={() => navigate("/register", { replace: true })}
                            className="text-lc-purple font-semibold hover:text-lc-purple/80 transition-colors"
                        >
                            Go back to register
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default VerifyOTP;
