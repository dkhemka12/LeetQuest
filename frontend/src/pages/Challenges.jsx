import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import {
    createChallenge,
    getChallenges,
    getDailyChallenge,
    getUserFriends,
    updateChallengeStatus,
} from "../services/userApi";

const challengeTopics = [
    "Array",
    "Strings",
    "Hash Table",
    "Linked List",
    "Stack",
    "Queue",
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Binary Search",
    "Greedy",
    "Sliding Window",
    "Two Pointers",
    "Backtracking",
];

const difficultyOptions = ["Easy", "Medium", "Hard"];

const formatDate = (value) => {
    if (!value) return "Not set";
    return new Date(value).toLocaleString();
};

const Challenges = () => {
    const { user } = useAuth();
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [busyId, setBusyId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        topic: "Array",
        difficulty: "Easy",
        targetQuestions: 1,
        deadline: "",
        opponent: "",
    });

    const preferredTopics = user?.preferredTopics || [];
    const canShowDaily = preferredTopics.length > 0;

    const activeChallenges = useMemo(
        () => challenges.filter((challenge) => challenge?.status !== "completed"),
        [challenges],
    );

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [daily, allChallenges, friendList] = await Promise.all([
                getDailyChallenge(),
                getChallenges(),
                getUserFriends(),
            ]);
            setDailyChallenge(daily);
            setChallenges(allChallenges);
            setFriends(friendList);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load challenges");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateChallenge = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            const challenge = await createChallenge({
                title: form.title || `Friend Challenge: ${form.topic}`,
                description: form.description,
                topic: form.topic,
                topics: [form.topic],
                difficulty: form.difficulty,
                targetQuestions: Number(form.targetQuestions || 1),
                deadline: form.deadline || null,
                opponent: form.opponent || null,
                type: "friend",
                status: "open",
            });
            setChallenges((current) => [challenge, ...current]);
            setForm({
                title: "",
                description: "",
                topic: "Array",
                difficulty: "Easy",
                targetQuestions: 1,
                deadline: "",
                opponent: "",
            });
            setSuccess("Challenge created");
            setTimeout(() => setSuccess(""), 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create challenge");
        } finally {
            setSaving(false);
        }
    };

    const handleMarkComplete = async (challengeId) => {
        try {
            setBusyId(challengeId);
            setError("");
            const updated = await updateChallengeStatus(challengeId, { status: "completed" });
            setChallenges((current) =>
                current.map((challenge) =>
                    challenge._id === challengeId ? updated : challenge,
                ),
            );
            if (dailyChallenge?._id === challengeId) {
                setDailyChallenge(updated);
            }
            setSuccess("Challenge marked complete");
            setTimeout(() => setSuccess(""), 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update challenge");
        } finally {
            setBusyId("");
        }
    };

    if (loading && !dailyChallenge && challenges.length === 0) {
        return (
            <section className="space-y-6">
                <PageHeader
                    eyebrow="Challenges"
                    title="Loading challenge hub..."
                    description="Gathering your daily challenge, friend matchups, and active contests."
                />
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Challenges"
                title="Compete with friends and beat the daily board"
                description="Daily challenges are generated from the topics you choose in your profile. Friend challenges let you build private matchups with deadlines and target goals."
            />

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                    {success}
                </div>
            )}

            {!canShowDaily && (
                <div className="rounded-2xl border border-orange/30 bg-orange/10 p-5 text-sm text-text-main">
                    Set your preferred topics in Profile to unlock personalized daily challenges.
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-border bg-dark-gray p-6 shadow-lg shadow-black/10">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Daily Challenge</p>
                            <h2 className="mt-2 text-2xl font-bold text-text-main">
                                {dailyChallenge?.title || "No daily challenge yet"}
                            </h2>
                            <p className="mt-2 text-sm text-text-muted">
                                {dailyChallenge?.description || "Your daily prompt is generated from the topics you selected."}
                            </p>
                        </div>
                        <button
                            onClick={loadData}
                            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-main transition-colors hover:border-orange hover:text-orange"
                        >
                            Refresh
                        </button>
                    </div>

                    {dailyChallenge ? (
                        <div className="mt-6 space-y-4 rounded-2xl border border-border bg-dark p-5">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
                                    {dailyChallenge.difficulty}
                                </span>
                                <span className="rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green">
                                    {dailyChallenge.topic}
                                </span>
                                <span className="rounded-full bg-light-gray px-3 py-1 text-xs font-semibold text-text-muted">
                                    Due {formatDate(dailyChallenge.deadline)}
                                </span>
                            </div>

                            {dailyChallenge.questionTitle ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-text-muted">Question</p>
                                    {dailyChallenge.questionUrl ? (
                                        <a
                                            href={dailyChallenge.questionUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-lg font-semibold text-text-main transition-colors hover:text-orange"
                                        >
                                            {dailyChallenge.questionTitle}
                                        </a>
                                    ) : (
                                        <p className="text-lg font-semibold text-text-main">{dailyChallenge.questionTitle}</p>
                                    )}
                                </div>
                            ) : null}

                            {dailyChallenge.topics?.length ? (
                                <div>
                                    <p className="text-sm text-text-muted">Topics</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {dailyChallenge.topics.map((topic) => (
                                            <span
                                                key={topic}
                                                className="rounded-full border border-border px-3 py-1 text-xs text-text-main"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleMarkComplete(dailyChallenge._id)}
                                    disabled={busyId === dailyChallenge._id || dailyChallenge.status === "completed"}
                                    className="rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {dailyChallenge.status === "completed" ? "Completed" : "Mark Complete"}
                                </button>
                                {dailyChallenge.questionUrl ? (
                                    <a
                                        href={dailyChallenge.questionUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-main transition-colors hover:border-orange hover:text-orange"
                                    >
                                        Open on LeetCode
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <EmptyState
                                title="Daily challenge not ready"
                                description="Add preferred topics in your profile and refresh to generate a fresh challenge."
                            />
                        </div>
                    )}
                </div>

                <form
                    onSubmit={handleCreateChallenge}
                    className="rounded-3xl border border-border bg-dark-gray p-6 shadow-lg shadow-black/10"
                >
                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Friend Challenge</p>
                    <h2 className="mt-2 text-2xl font-bold text-text-main">Create a matchup</h2>
                    <p className="mt-2 text-sm text-text-muted">
                        Pick a friend, a topic, and a deadline. The challenge can later be promoted into a clan battle.
                    </p>

                    <div className="mt-6 space-y-4">
                        <input
                            type="text"
                            value={form.title}
                            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                            placeholder="Challenge title"
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                        />
                        <textarea
                            rows="3"
                            value={form.description}
                            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                            placeholder="Challenge description"
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <select
                                value={form.topic}
                                onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                            >
                                {challengeTopics.map((topic) => (
                                    <option key={topic} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={form.difficulty}
                                onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value }))}
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                            >
                                {difficultyOptions.map((difficulty) => (
                                    <option key={difficulty} value={difficulty}>
                                        {difficulty}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <select
                                value={form.opponent}
                                onChange={(event) => setForm((current) => ({ ...current, opponent: event.target.value }))}
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                            >
                                <option value="">Choose a friend</option>
                                {friends.map((friend) => (
                                    <option key={friend._id} value={friend._id}>
                                        {friend.firstName || friend.username} ({friend.username})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={form.targetQuestions}
                                onChange={(event) => setForm((current) => ({ ...current, targetQuestions: event.target.value }))}
                                placeholder="Target questions"
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                            />
                        </div>
                        <input
                            type="datetime-local"
                            value={form.deadline}
                            onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-colors focus:border-orange"
                        />
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-xl bg-orange px-4 py-3 font-semibold text-dark transition-colors hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Creating..." : "Create challenge"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Your Challenges</p>
                        <h2 className="mt-1 text-2xl font-bold text-text-main">Active matchups and history</h2>
                    </div>
                    <button
                        onClick={loadData}
                        className="text-sm font-medium text-orange transition-colors hover:text-orange-hover"
                    >
                        Reload
                    </button>
                </div>

                {activeChallenges.length === 0 ? (
                    <EmptyState
                        title="No active challenges"
                        description="Create a friend challenge or generate your daily challenge to get started."
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {activeChallenges.map((challenge) => (
                            <article key={challenge._id} className="rounded-2xl border border-border bg-dark-gray p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-main">{challenge.title}</h3>
                                        <p className="mt-1 text-sm text-text-muted">{challenge.description}</p>
                                    </div>
                                    <span className="rounded-full bg-light-gray px-3 py-1 text-xs font-semibold text-text-muted">
                                        {challenge.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-full bg-orange/10 px-3 py-1 text-orange">{challenge.topic}</span>
                                    <span className="rounded-full bg-green/10 px-3 py-1 text-green">{challenge.difficulty}</span>
                                    <span className="rounded-full bg-light-gray px-3 py-1 text-text-muted">
                                        Due {formatDate(challenge.deadline)}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <p className="text-xs text-text-muted">
                                        {challenge.opponent?.username
                                            ? `Vs ${challenge.opponent.username}`
                                            : challenge.type === "daily"
                                                ? "Daily challenge"
                                                : "Solo challenge"}
                                    </p>
                                    <button
                                        onClick={() => handleMarkComplete(challenge._id)}
                                        disabled={busyId === challenge._id || challenge.status === "completed"}
                                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-main transition-colors hover:border-orange hover:text-orange disabled:opacity-60"
                                    >
                                        {challenge.status === "completed" ? "Done" : "Complete"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Challenges;
