import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/userApi";

const CompleteProfile = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.firstName && user?.lastName) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate, user?.firstName, user?.lastName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError("First and last name are required to continue.");
            return;
        }

        try {
            setLoading(true);
            const updated = await updateUserProfile({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
            });

            login({ ...user, ...updated, token: user.token });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-12">
            <div className="w-full rounded-3xl border border-border bg-dark-gray p-8 shadow-2xl">
                <PageHeader
                    eyebrow="Complete profile"
                    title={`Welcome${user?.username ? `, ${user.username}` : ""}`}
                    description="Add your first and last name so LeetQuest can greet you personally on the dashboard."
                />

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50"
                        />
                    </div>

                    <div className="rounded-2xl border border-border bg-dark px-4 py-3 text-sm text-text-muted">
                        Tip: you can still update your LeetCode username and other details later from Profile.
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-500 bg-opacity-10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-orange px-4 py-3 font-semibold text-dark transition-all duration-300 hover:scale-105 hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Finish profile"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CompleteProfile;