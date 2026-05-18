import React, { useEffect, useMemo, useState } from "react";
import { FiSend, FiMail, FiStar } from "react-icons/fi";
import PageHeader from "./PageHeader";
import { useAuth } from "../context/AuthContext";
import { submitSupportRequest } from "../services/supportApi";

const defaultCategories = [
    "Bug report",
    "Feature request",
    "Design feedback",
    "Performance",
    "Other",
];

const SupportRequestForm = ({
    eyebrow,
    title,
    description,
    submitLabel,
    type,
    defaultSubject,
    includeCategory = false,
    includeRating = false,
    categoryOptions = defaultCategories,
    accent = "orange",
    hint,
}) => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: defaultSubject || "",
        category: categoryOptions[0] || "",
        rating: 5,
        body: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setForm((current) => ({
            ...current,
            name: user?.firstName
                ? [user.firstName, user.lastName].filter(Boolean).join(" ")
                : user?.username || current.name,
            email: user?.email || current.email,
        }));
    }, [user]);

    const accentClasses = useMemo(() => {
        if (accent === "green") {
            return {
                ring: "focus:ring-green/40",
                button: "bg-green text-dark hover:bg-green/90",
                badge: "bg-green/10 text-green border-green/20",
            };
        }

        if (accent === "yellow") {
            return {
                ring: "focus:ring-yellow/40",
                button: "bg-yellow text-dark hover:bg-yellow/90",
                badge: "bg-yellow/10 text-yellow border-yellow/20",
            };
        }

        return {
            ring: "focus:ring-orange/40",
            button: "bg-orange text-dark hover:bg-orange-hover",
            badge: "bg-orange/10 text-orange border-orange/20",
        };
    }, [accent]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await submitSupportRequest({
                type,
                name: form.name.trim(),
                email: form.email.trim(),
                subject: form.subject.trim(),
                category: includeCategory ? form.category : "",
                rating: includeRating ? Number(form.rating) : undefined,
                body: form.body.trim(),
            });

            setSuccess(
                type === "feedback"
                    ? "Thanks for the feedback. We read every response."
                    : "Your message was sent. We’ll get back to you soon.",
            );
            setForm((current) => ({
                ...current,
                subject: defaultSubject || "",
                category: categoryOptions[0] || "",
                rating: 5,
                body: "",
            }));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to send your request right now.");
        } finally {
            setLoading(false);
        }
    };

    const pageTone = type === "feedback" ? "Feedback" : "Message";

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow={eyebrow || pageTone}
                title={title}
                description={description}
            />

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-border bg-dark-gray/95 p-6 shadow-lg">
                    {error ? (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    ) : null}
                    {success ? (
                        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                            {success}
                        </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 text-sm">
                            <span className="text-text-muted">Name</span>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                placeholder="Your name"
                                required
                                className={`w-full rounded-2xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition focus:ring-2 ${accentClasses.ring}`}
                            />
                        </label>
                        <label className="space-y-2 text-sm">
                            <span className="text-text-muted">Email</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                                placeholder="you@example.com"
                                required
                                className={`w-full rounded-2xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition focus:ring-2 ${accentClasses.ring}`}
                            />
                        </label>
                    </div>

                    <label className="space-y-2 text-sm">
                        <span className="text-text-muted">Subject</span>
                        <input
                            type="text"
                            value={form.subject}
                            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                            placeholder="What should we know?"
                            required
                            className={`w-full rounded-2xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition focus:ring-2 ${accentClasses.ring}`}
                        />
                    </label>

                    {includeCategory ? (
                        <label className="space-y-2 text-sm">
                            <span className="text-text-muted">Category</span>
                            <select
                                value={form.category}
                                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                                className={`w-full rounded-2xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition focus:ring-2 ${accentClasses.ring}`}
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ) : null}

                    {includeRating ? (
                        <div className="space-y-2 text-sm">
                            <span className="text-text-muted">Rating</span>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                        key={score}
                                        type="button"
                                        onClick={() => setForm((current) => ({ ...current, rating: score }))}
                                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${Number(form.rating) === score
                                            ? accentClasses.badge
                                            : "border-border bg-dark text-text-muted hover:border-orange/40 hover:text-text-main"
                                            }`}
                                    >
                                        <FiStar size={14} /> {score}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <label className="space-y-2 text-sm">
                        <span className="text-text-muted">{type === "feedback" ? "Feedback" : "Message"}</span>
                        <textarea
                            rows="7"
                            value={form.body}
                            onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
                            placeholder={type === "feedback" ? "Tell us what you’d improve or what you love." : "Describe your question or request."}
                            required
                            className={`w-full rounded-2xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition focus:ring-2 ${accentClasses.ring}`}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${accentClasses.button}`}
                    >
                        <FiSend size={16} />
                        {loading ? "Sending..." : submitLabel}
                    </button>
                </form>

                <div className="space-y-4 rounded-3xl border border-border bg-gradient-to-b from-dark-gray to-dark p-6 shadow-lg">
                    <div className="rounded-2xl border border-border bg-dark p-5">
                        <div className="flex items-center gap-3">
                            <div className={`rounded-2xl border px-3 py-3 ${accentClasses.badge}`}>
                                <FiMail size={18} />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-text-muted">What happens next</p>
                                <h3 className="text-xl font-semibold text-text-main">We route it to the team</h3>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-text-muted">
                            {type === "feedback"
                                ? "Feedback is sent straight to the team by email."
                                : "Messages are emailed directly to the team for follow-up."}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-dark p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Tips</p>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-text-muted">
                            <li>• Keep the subject short and specific.</li>
                            <li>• Include screenshots or details in the body if needed.</li>
                            <li>• Feedback helps shape the next set of improvements.</li>
                        </ul>
                    </div>

                    {hint ? (
                        <div className="rounded-2xl border border-border bg-dark p-5 text-sm text-text-muted">
                            {hint}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default SupportRequestForm;
