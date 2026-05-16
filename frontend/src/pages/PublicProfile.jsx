import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiExternalLink, FiArrowLeft } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { getPublicProfile, formatTimeAgo } from "../services/userApi";

const difficultyColors = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
};

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, [username]);

    const handleViewFullHistory = () => {
        if (profile?.username && profile?.username !== "unknown") {
            // Link to their public profile which shows recent activity
        }
    };

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getPublicProfile(username);
            console.log("Public profile data:", data);
            setProfile(data);
        } catch (err) {
            console.error("Public profile error:", err);
            setError(err.response?.data?.message || "Failed to load public profile");
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="space-y-6">
                <PageHeader eyebrow="Profile" title="Loading..." />
                <div className="text-center text-text-muted">Loading profile...</div>
            </section>
        );
    }

    if (error || !profile) {
        return (
            <section className="space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors"
                >
                    <FiArrowLeft size={16} /> Go back
                </button>
                <PageHeader eyebrow="Profile" title="Not Found" />
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-8 py-12 text-center">
                    <p className="text-red-400">{error || "User profile not found"}</p>
                </div>
            </section>
        );
    }

    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
    const totalSolved =
        (profile.easySolved || 0) + (profile.mediumSolved || 0) + (profile.hardSolved || 0);
    const joinedDate = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString()
        : "Unknown";

    return (
        <section className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors"
            >
                <FiArrowLeft size={16} /> Go back
            </button>

            <PageHeader
                eyebrow="Profile"
                title={displayName || profile.username}
                description={`@${profile.username}`}
            />

            {/* Profile Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard label="Level" value={profile.level || 1} highlight />
                <StatCard label="XP" value={(profile.xp || 0).toLocaleString()} />
                <StatCard label="Streak" value={profile.streak || 0} />
                <StatCard label="Consistency" value={`${profile.consistencyScore || 0}%`} />
                <StatCard label="Problems Solved" value={totalSolved} highlight />
            </div>

            {/* Problem Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Easy Solved</p>
                    <p className="mt-2 text-4xl font-bold text-green-500">{profile.easySolved || 0}</p>
                </div>
                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Medium Solved</p>
                    <p className="mt-2 text-4xl font-bold text-yellow-500">{profile.mediumSolved || 0}</p>
                </div>
                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Hard Solved</p>
                    <p className="mt-2 text-4xl font-bold text-red-500">{profile.hardSolved || 0}</p>
                </div>
            </div>

            {/* LeetCode Info */}
            {profile.leetcodeUsername && (
                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                    <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">LeetCode Connection</h3>
                    <p className="text-sm text-text-main">
                        LeetCode: <span className="font-semibold text-orange">{profile.leetcodeUsername}</span>
                    </p>
                    <a
                        href={`https://leetcode.com/${profile.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-orange px-4 py-2 text-sm font-semibold text-orange transition-all hover:bg-orange/10"
                    >
                        Visit LeetCode Profile <FiExternalLink size={14} />
                    </a>
                </div>
            )}

            {/* Recent Activity */}
            {profile.recentActivities && profile.recentActivities.length > 0 && (
                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                    <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">Recent Activity</h3>
                    <div className="space-y-2">
                        {profile.recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border border-border/50 bg-dark px-4 py-3 hover:border-orange/50 transition-colors">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-text-main">{activity.title}</p>
                                    <p className={`text-xs font-semibold ${difficultyColors[activity.difficulty] || "text-text-muted"}`}>
                                        {activity.difficulty}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-muted">{formatTimeAgo(activity.solvedAt)}</span>
                                    {activity.questionUrl && (
                                        <a
                                            href={activity.questionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange hover:text-orange/80 transition-colors"
                                            title="Open on LeetCode"
                                        >
                                            <FiExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Info */}
            <div className="rounded-2xl border border-border bg-dark-gray p-6">
                <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-text-muted">Member Since</h3>
                <p className="text-sm text-text-main">{joinedDate}</p>
            </div>
        </section>
    );
};

export default PublicProfile;
