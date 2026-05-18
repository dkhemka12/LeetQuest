import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile, formatTimeAgo } from "../services/userApi";
import { clearAndResyncLeetcode } from "../services/leetcodeApi";
import { FiEdit2, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";

const Profile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [tempUsername, setTempUsername] = useState(user?.leetcodeUsername || "");
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
    });
    const [topicDraft, setTopicDraft] = useState(user?.preferredTopics || []);

    const topicOptions = [
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

    // Load full profile on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserProfile();
            setProfile(data);
            setTopicDraft(data?.preferredTopics || []);
            setError("");
        } catch (err) {
            setError("Failed to load profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSaveLeetcodeUsername = async () => {
        if (!tempUsername.trim()) {
            setError("LeetCode username cannot be empty");
            return;
        }

        try {
            setLoading(true);
            const updated = await updateUserProfile({
                leetcodeUsername: tempUsername.trim(),
            });
            setProfile(updated);
            setUser(updated); // Update global auth context
            // Preserve token when saving to localStorage
            const token = localStorage.getItem("authToken");
            if (token) {
                window.localStorage.setItem("leetquest-user", JSON.stringify({ ...updated, token }));
            }
            setIsEditingUsername(false);
            setSuccess("LeetCode username updated!");
            setTimeout(() => setSuccess(""), 3000);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update username");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setTempUsername(profile?.leetcodeUsername || "");
        setIsEditingUsername(false);
        setError("");
    };

    const handleSaveName = async () => {
        if (!nameDraft.firstName.trim() || !nameDraft.lastName.trim()) {
            setError("First and last name are required");
            return;
        }

        try {
            setLoading(true);
            const updated = await updateUserProfile({
                firstName: nameDraft.firstName.trim(),
                lastName: nameDraft.lastName.trim(),
            });
            const token = localStorage.getItem("authToken");
            const nextUser = token ? { ...updated, token } : updated;
            setProfile(nextUser);
            setUser(nextUser);
            if (token) {
                window.localStorage.setItem("leetquest-user", JSON.stringify(nextUser));
            }
            setIsEditingName(false);
            setSuccess("Profile name updated!");
            setTimeout(() => setSuccess(""), 3000);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update name");
        } finally {
            setLoading(false);
        }
    };

    const handleClearAndResync = async () => {
        if (!window.confirm("This will delete all activity history and fetch fresh data. Continue?")) {
            return;
        }

        try {
            setLoading(true);
            await clearAndResyncLeetcode();
            await loadProfile();
            setSuccess("Activities cleared and data re-synced successfully!");
            setTimeout(() => setSuccess(""), 3000);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to clear and resync");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTopics = async () => {
        try {
            setLoading(true);
            const updated = await updateUserProfile({
                preferredTopics: topicDraft,
            });
            const token = localStorage.getItem("authToken");
            const nextUser = token ? { ...updated, token } : updated;
            setProfile(nextUser);
            setUser(nextUser);
            if (token) {
                window.localStorage.setItem("leetquest-user", JSON.stringify(nextUser));
            }
            setSuccess("Practice topics updated!");
            setTimeout(() => setSuccess(""), 3000);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update practice topics");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <section className="space-y-6">
                <PageHeader eyebrow="Profile" title="Loading..." />
                <div className="text-center text-text-muted">Loading profile...</div>
            </section>
        );
    }

    const totalSolved = (profile?.easySolved || 0) + (profile?.mediumSolved || 0) + (profile?.hardSolved || 0);
    const createdDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A";
    const lastSynced = profile?.lastSyncedAt ? formatTimeAgo(profile.lastSyncedAt) : "Never";
    const profileName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Profile"
                title={profileName || profile?.username || "Your Profile"}
                description="Manage your account settings and LeetCode connection"
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

            {/* Account Info Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column: Account Settings */}
                <div className="space-y-6">
                    {/* Basic Account Info */}
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">Account Information</h3>
                        <div className="space-y-4">
                            {isEditingName ? (
                                <div className="space-y-3 rounded-lg border border-border bg-dark p-3">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <input
                                            type="text"
                                            value={nameDraft.firstName}
                                            onChange={(e) => setNameDraft((prev) => ({ ...prev, firstName: e.target.value }))}
                                            placeholder="First name"
                                            disabled={loading}
                                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50"
                                        />
                                        <input
                                            type="text"
                                            value={nameDraft.lastName}
                                            onChange={(e) => setNameDraft((prev) => ({ ...prev, lastName: e.target.value }))}
                                            placeholder="Last name"
                                            disabled={loading}
                                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none transition-all disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveName}
                                            disabled={loading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600/70 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-60"
                                        >
                                            <FiCheck size={16} /> Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNameDraft({
                                                    firstName: profile?.firstName || "",
                                                    lastName: profile?.lastName || "",
                                                });
                                                setIsEditingName(false);
                                            }}
                                            disabled={loading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-dark px-3 py-2.5 text-sm font-semibold text-text-main transition-all hover:border-orange disabled:opacity-60"
                                        >
                                            <FiX size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            {/* Username */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-text-muted">Username</p>
                                    <p className="text-sm font-semibold text-text-main">{profile?.username}</p>
                                </div>
                                <span className="text-xs text-text-muted">Read-only</span>
                            </div>

                            {/* Name */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-text-muted">Display Name</p>
                                    <p className="text-sm font-semibold text-text-main">
                                        {profileName || "Not set yet"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNameDraft({
                                            firstName: profile?.firstName || "",
                                            lastName: profile?.lastName || "",
                                        });
                                        setIsEditingName(true);
                                    }}
                                    className="text-orange transition-all hover:text-orange-hover"
                                >
                                    <FiEdit2 size={16} />
                                </button>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-text-muted">Email</p>
                                    <p className="text-sm font-semibold text-text-main">{profile?.email}</p>
                                </div>
                                <span className="text-xs text-text-muted">Verified</span>
                            </div>

                            {/* Account Created */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-text-muted">Created</p>
                                    <p className="text-sm font-semibold text-text-main">{createdDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LeetCode Connection */}
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">LeetCode Connection</h3>

                        {isEditingUsername ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={tempUsername}
                                    onChange={(e) => setTempUsername(e.target.value)}
                                    placeholder="Enter your LeetCode username"
                                    className="w-full rounded-lg border border-orange bg-dark px-3 py-2.5 text-sm text-text-main outline-none placeholder:text-text-muted"
                                    disabled={loading}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveLeetcodeUsername}
                                        disabled={loading}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600/70 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-60"
                                    >
                                        <FiCheck size={16} /> Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-dark px-3 py-2.5 text-sm font-semibold text-text-main transition-all hover:border-orange disabled:opacity-60"
                                    >
                                        <FiX size={16} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="rounded-lg border border-border bg-dark px-3 py-2.5">
                                    <p className="text-xs text-text-muted">LeetCode Username</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-text-main">
                                            {profile?.leetcodeUsername || "Not connected"}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setTempUsername(profile?.leetcodeUsername || "");
                                                setIsEditingUsername(true);
                                            }}
                                            className="text-orange transition-all hover:text-orange-hover"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {profile?.leetcodeUsername && (
                                    <div className="rounded-lg border border-border/50 bg-dark px-3 py-2.5">
                                        <p className="text-xs text-text-muted">Last Synced</p>
                                        <p className="text-sm font-semibold text-orange">{lastSynced}</p>
                                    </div>
                                )}
                                {profile?.leetcodeUsername && (
                                    <button
                                        onClick={handleClearAndResync}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-60"
                                    >
                                        <FiRefreshCw size={16} /> Clear Activities & Re-sync
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">Practice Topics</h3>
                        <p className="mb-4 text-sm text-text-muted">
                            Pick the topics you want the daily challenge engine to pull from.
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {topicOptions.map((topic) => {
                                const checked = topicDraft.includes(topic);
                                return (
                                    <label
                                        key={topic}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${checked
                                                ? "border-orange bg-orange/10 text-text-main"
                                                : "border-border bg-dark text-text-muted hover:border-orange/50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                setTopicDraft((current) =>
                                                    current.includes(topic)
                                                        ? current.filter((item) => item !== topic)
                                                        : [...current, topic],
                                                );
                                            }}
                                            className="h-4 w-4 accent-orange"
                                        />
                                        <span>{topic}</span>
                                    </label>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            onClick={handleSaveTopics}
                            disabled={loading}
                            className="mt-4 w-full rounded-xl bg-orange px-4 py-3 text-sm font-semibold text-dark transition-colors hover:bg-orange-hover disabled:opacity-60"
                        >
                            Save preferred topics
                        </button>
                    </div>
                </div>

                {/* Right Column: Stats & Badges */}
                <div className="space-y-6">
                    {/* LeetCode Stats */}
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">LeetCode Stats</h3>
                        <div className="space-y-3">
                            {/* Total Solved */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Total Solved</span>
                                <span className="font-semibold text-orange">{totalSolved}</span>
                            </div>

                            {/* Easy */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Easy</span>
                                <span className="font-semibold text-green-500">{profile?.easySolved || 0}</span>
                            </div>

                            {/* Medium */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Medium</span>
                                <span className="font-semibold text-yellow-500">{profile?.mediumSolved || 0}</span>
                            </div>

                            {/* Hard */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Hard</span>
                                <span className="font-semibold text-red-500">{profile?.hardSolved || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Gamification Stats */}
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">Gamification</h3>
                        <div className="space-y-3">
                            {/* XP */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Total XP</span>
                                <span className="font-semibold text-orange">{profile?.xp || 0}</span>
                            </div>

                            {/* Level */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Level</span>
                                <span className="font-semibold text-orange">Level {profile?.level || 1}</span>
                            </div>

                            {/* Streak */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Current Streak</span>
                                <span className="font-semibold text-orange">{profile?.streak || 0} days</span>
                            </div>

                            {/* Consistency */}
                            <div className="flex items-center justify-between rounded-lg border border-border bg-dark px-3 py-2.5">
                                <span className="text-sm text-text-muted">Consistency Score</span>
                                <span className="font-semibold text-orange">{Math.round(profile?.consistencyScore || 0)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Badges */}
                    {profile?.badges && profile.badges.length > 0 && (
                        <div className="rounded-2xl border border-border bg-dark-gray p-6">
                            <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">Badges</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.badges.map((badge, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-block rounded-full border border-orange bg-orange/10 px-3 py-1 text-xs font-semibold text-orange"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {(!profile?.badges || profile.badges.length === 0) && (
                        <div className="rounded-2xl border border-dashed border-border bg-dark-gray p-6 text-center">
                            <p className="text-sm text-text-muted">No badges earned yet.</p>
                            <p className="text-xs text-text-muted">Solve problems and maintain streaks to unlock badges!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;
