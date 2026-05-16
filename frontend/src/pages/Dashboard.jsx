import React, { useEffect, useMemo, useRef, useState } from "react";
import XPCard from "../components/XPCard";
import StreakCard from "../components/StreakCard";
import ProgressChart from "../components/ProgressChart";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Leaderboard from "../components/Leaderboard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/dashboardApi";
import { syncLeetcodeData } from "../services/leetcodeApi";
import { updateUserProfile } from "../services/userApi";

const buildFallbackDashboard = (user) => {
    const easy = user?.easySolved || 0;
    const medium = user?.mediumSolved || 0;
    const hard = user?.hardSolved || 0;

    return {
        summary: {
            xp: user?.xp || 0,
            level: user?.level || 1,
            streak: user?.streak || 0,
            consistencyScore: user?.consistencyScore || 0,
            solved: {
                easy,
                medium,
                hard,
                total: easy + medium + hard,
            },
        },
        chartData: [
            { name: "Easy", solved: easy },
            { name: "Medium", solved: medium },
            { name: "Hard", solved: hard },
        ],
        leaderboard: [],
    };
};

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const cardsRef = useRef(null);
    const chartsRef = useRef(null);
    const emptyStateRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dashboardData, setDashboardData] = useState(() => buildFallbackDashboard(user));
    const [leetcodeUsername, setLeetcodeUsername] = useState(user?.leetcodeUsername || "");
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncError, setSyncError] = useState("");

    useEffect(() => {
        let mounted = true;

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getDashboardSummary();
                if (!mounted) {
                    return;
                }

                setDashboardData({
                    summary: response.data?.summary || buildFallbackDashboard(user).summary,
                    chartData: response.data?.chartData || buildFallbackDashboard(user).chartData,
                    leaderboard: response.data?.leaderboard || [],
                });
            } catch (err) {
                if (!mounted) {
                    return;
                }

                setDashboardData(buildFallbackDashboard(user));
                setError("Live dashboard data unavailable. Showing cached profile stats.");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            mounted = false;
        };
    }, [user]);

    const handleCardHover = (e) => {
        // CSS transition handles the animation
    };


    const handleSaveLeetcodeUsername = async () => {
        if (!leetcodeUsername.trim()) {
            setSyncError("Please enter a valid LeetCode username");
            return;
        }

        try {
            setSyncLoading(true);
            setSyncError("");

            // Update user profile with username
            await updateUserProfile({ leetcodeUsername: leetcodeUsername.trim() });

            // Sync LeetCode data
            await syncLeetcodeData(leetcodeUsername.trim());

            // Update local user context
            setUser({ ...user, leetcodeUsername: leetcodeUsername.trim() });

            // Reload dashboard
            window.location.reload();
        } catch (err) {
            setSyncError(err.response?.data?.message || "Failed to sync LeetCode data");
        } finally {
            setSyncLoading(false);
        }
    };

    {/* LeetCode Username Setup */ }
    {
        !user?.leetcodeUsername && (
            <div className="rounded-2xl border-2 border-lc-purple border-opacity-50 bg-lc-purple/10 px-5 py-4 text-text-main shadow-lg">
                <p className="text-sm uppercase tracking-[0.24em] text-lc-purple font-semibold">Connect Your LeetCode</p>
                <p className="mt-2 text-sm text-text-secondary">
                    Enter your LeetCode username to automatically sync your problems solved, streaks, and progress.
                </p>
                <div className="mt-4 flex gap-3">
                    <input
                        type="text"
                        placeholder="Enter LeetCode username"
                        value={leetcodeUsername}
                        onChange={(e) => {
                            setLeetcodeUsername(e.target.value);
                            setSyncError("");
                        }}
                        disabled={syncLoading}
                        className="flex-1 rounded-lg border border-border bg-dark px-4 py-2 text-sm text-text-main outline-none disabled:opacity-50 focus:border-lc-purple focus:ring-1 focus:ring-lc-purple/20"
                    />
                    <button
                        onClick={handleSaveLeetcodeUsername}
                        disabled={syncLoading || !leetcodeUsername.trim()}
                        className="rounded-lg bg-lc-purple px-6 py-2 font-semibold text-white transition-all disabled:opacity-50 hover:enabled:bg-lc-purple/90 active:enabled:scale-95"
                    >
                        {syncLoading ? "Syncing..." : "Sync"}
                    </button>
                </div>
                {syncError && (
                    <p className="mt-2 text-xs text-red-400">{syncError}</p>
                )}
            </div>
        )
    }
    const handleCardHoverOut = (e) => {
        // CSS transition handles the animation
    };

    const solvedTotal = useMemo(() => dashboardData.summary?.solved?.total || 0, [dashboardData]);
    const consistencyScore = useMemo(() => dashboardData.summary?.consistencyScore || 0, [dashboardData]);
    const xp = useMemo(() => dashboardData.summary?.xp || 0, [dashboardData]);
    const level = useMemo(() => dashboardData.summary?.level || 1, [dashboardData]);
    const streak = useMemo(() => dashboardData.summary?.streak || 0, [dashboardData]);
    const chartData = useMemo(() => dashboardData.chartData || [], [dashboardData]);
    const leaderboard = useMemo(() => dashboardData.leaderboard || [], [dashboardData]);
    const displayName = user?.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}` : user?.username || "there";

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Overview"
                title={`Hi, ${displayName} `}
                description="Track solved problems, consistency, XP progression, and leaderboard rank from one place."
            />

            {loading ? <p className="text-sm text-text-muted">Loading dashboard...</p> : null}
            {error ? <p className="text-sm text-yellow">{error}</p> : null}

            <div ref={cardsRef} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div
                    className="cursor-pointer transition-all"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <StatCard label="Solved" value={solvedTotal} detail="Problems synced from LeetCode" tone="green" />
                </div>
                <div
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <StatCard label="Consistency" value={`${consistencyScore}%`} detail="Your activity momentum" tone="yellow" />
                </div>
                <div
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <XPCard xp={xp} level={level} />
                </div>
                <div
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <StreakCard streak={streak} />
                </div>
            </div>

            <div ref={chartsRef} className="grid gap-6 lg:grid-cols-2">
                <div className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <ProgressChart data={chartData} />
                </div>
                <div className="cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                    onMouseEnter={handleCardHover}
                    onMouseLeave={handleCardHoverOut}
                >
                    <Leaderboard users={leaderboard} />
                </div>
            </div>

            <div ref={emptyStateRef}>
                {solvedTotal === 0 ? (
                    <EmptyState
                        title="No activity synced yet"
                        description="Once a LeetCode username is connected, this area can show recent submissions, weak topics, and badges."
                    />
                ) : null}
            </div>
        </section>
    );
};

export default Dashboard;
