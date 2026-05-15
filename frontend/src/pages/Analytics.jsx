import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import PageHeader from "../components/PageHeader";
import { getAnalyticsOverview } from "../services/dashboardApi";
import { useAuth } from "../context/AuthContext";
import { triggerSync, startPeriodicSync, stopPeriodicSync, isSyncRunning } from "../services/autoSyncService";
import { formatTimeAgo } from "../services/userApi";

const DIFFICULTY_COLORS = {
    Easy: "bg-green",
    Medium: "bg-orange",
    Hard: "bg-red",
};

const buildFallbackAnalytics = (user) => {
    const easy = user?.easySolved || 0;
    const medium = user?.mediumSolved || 0;
    const hard = user?.hardSolved || 0;

    return {
        summary: {
            activityCount: 0,
            xp: user?.xp || 0,
            streak: user?.streak || 0,
            consistencyScore: user?.consistencyScore || 0,
            totalSolved: easy + medium + hard,
        },
        difficultyBreakdown: [
            { name: "Easy", solved: easy },
            { name: "Medium", solved: medium },
            { name: "Hard", solved: hard },
        ],
        weeklyActivity: [
            { day: "Mon", solved: 0 },
            { day: "Tue", solved: 0 },
            { day: "Wed", solved: 0 },
            { day: "Thu", solved: 0 },
            { day: "Fri", solved: 0 },
            { day: "Sat", solved: 0 },
            { day: "Sun", solved: 0 },
        ],
        recentActivities: [],
    };
};

const Analytics = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");
    const [analytics, setAnalytics] = useState(() => buildFallbackAnalytics(user));

    useEffect(() => {
        const isMountedRef = { current: true };

        // Trigger immediate sync on load if username is set
        if (user?.leetcodeUsername) {
            triggerSync(user.leetcodeUsername).then(() => {
                if (isMountedRef.current) {
                    loadAnalytics(isMountedRef);
                }
            });
        } else {
            loadAnalytics(isMountedRef);
        }

        // Start periodic sync if not already running and username is set
        if (user?.leetcodeUsername && !isSyncRunning()) {
            startPeriodicSync(user.leetcodeUsername, 6 * 60 * 60 * 1000); // 6 hours
        }

        return () => {
            isMountedRef.current = false;
            // Don't stop periodic sync here - let it continue in background
        };
    }, [user?.leetcodeUsername]);

    const loadAnalytics = useCallback(async (isMountedRef = { current: true }) => {
        setLoading(true);
        setError("");

        try {
            const response = await getAnalyticsOverview();
            if (!isMountedRef.current) {
                return;
            }

            const fallback = buildFallbackAnalytics(user);
            setAnalytics({
                summary: response.data?.summary || fallback.summary,
                difficultyBreakdown: response.data?.difficultyBreakdown || fallback.difficultyBreakdown,
                weeklyActivity: response.data?.weeklyActivity || fallback.weeklyActivity,
                recentActivities: response.data?.recentActivities || [],
            });
        } catch (err) {
            if (!isMountedRef.current) {
                return;
            }

            setAnalytics(buildFallbackAnalytics(user));
            setError("Live analytics unavailable. Showing cached profile stats.");
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [user]);

    const handleManualSync = async () => {
        setSyncing(true);

        try {
            if (!user?.leetcodeUsername) {
                setError("Please add your LeetCode username first.");
                setSyncing(false);
                return;
            }
            await triggerSync(user.leetcodeUsername);
            await loadAnalytics();
            setError("");
        } catch {
            setError("Sync failed. Check your username or backend connection and try again.");
        } finally {
            setSyncing(false);
        }
    };

    const summary = useMemo(() => analytics.summary || {}, [analytics]);
    const weeklyActivity = useMemo(() => analytics.weeklyActivity || [], [analytics]);
    const difficultyBreakdown = useMemo(() => analytics.difficultyBreakdown || [], [analytics]);
    const recentActivities = useMemo(() => analytics.recentActivities || [], [analytics]);
    const weeklyTotal = useMemo(
        () => weeklyActivity.reduce((sum, day) => sum + (day.solved || 0), 0),
        [weeklyActivity],
    );
    const bestDay = useMemo(() => {
        if (!weeklyActivity.length) {
            return { day: "-", solved: 0 };
        }

        return weeklyActivity.reduce((max, day) =>
            (day.solved || 0) > (max.solved || 0) ? day : max,
        );
    }, [weeklyActivity]);
    const difficultyTotal = useMemo(
        () => difficultyBreakdown.reduce((sum, item) => sum + (item.solved || 0), 0),
        [difficultyBreakdown],
    );

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Analytics"
                title="Performance Analytics"
                description="Explore your solving rhythm, focus areas, and recent momentum with an analysis-first view."
            />

            <div className="space-y-3 rounded-2xl border border-border bg-dark-gray px-4 py-4">
                <p className="text-sm text-text-muted">
                    {user?.leetcodeUsername
                        ? `Syncing: ${user.leetcodeUsername} (auto-updates every 6 hours, last sync: ${formatTimeAgo(user.lastSyncedAt)})`
                        : "Add your LeetCode username in Profile to enable automatic syncing."}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleManualSync}
                        disabled={syncing || !user?.leetcodeUsername}
                        className="rounded-xl bg-orange px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {syncing ? "Syncing..." : "Sync Now"}
                    </button>
                </div>
            </div>

            {loading ? <p className="text-sm text-text-muted">Loading analytics...</p> : null}
            {error ? <p className="text-sm text-yellow">{error}</p> : null}

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <article className="rounded-3xl border border-border bg-linear-to-br from-dark-gray to-dark p-6 shadow-2xl">
                    <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Weekly Pulse</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-text-muted">Solved this week</p>
                            <p className="mt-1 text-3xl font-bold text-orange">{weeklyTotal}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted">Best day</p>
                            <p className="mt-1 text-3xl font-bold text-green">{bestDay.day}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted">Peak solves</p>
                            <p className="mt-1 text-3xl font-bold text-yellow">{bestDay.solved || 0}</p>
                        </div>
                    </div>
                    <div className="mt-6 h-64 rounded-2xl border border-border/60 bg-dark/70 p-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyActivity}>
                                <defs>
                                    <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffa116" stopOpacity={0.55} />
                                        <stop offset="95%" stopColor="#ffa116" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
                                <XAxis dataKey="day" stroke="#8a8a8a" />
                                <YAxis stroke="#8a8a8a" allowDecimals={false} />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="solved"
                                    stroke="#ffa116"
                                    strokeWidth={3}
                                    fill="url(#analyticsAreaFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="rounded-3xl border border-border bg-dark-gray p-6 shadow-2xl">
                    <p className="text-xs uppercase tracking-[0.25em] text-text-muted">Snapshot</p>
                    <div className="mt-4 space-y-4">
                        <div className="rounded-2xl border border-border bg-dark/70 px-4 py-3">
                            <p className="text-xs text-text-muted">Total Solved</p>
                            <p className="mt-1 text-2xl font-bold text-green">{summary.totalSolved || 0}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-dark/70 px-4 py-3">
                            <p className="text-xs text-text-muted">Consistency Score</p>
                            <p className="mt-1 text-2xl font-bold text-yellow">{summary.consistencyScore || 0}%</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-border bg-dark/70 px-4 py-3">
                                <p className="text-xs text-text-muted">Streak</p>
                                <p className="mt-1 text-xl font-semibold text-text-main">{summary.streak || 0}d</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-dark/70 px-4 py-3">
                                <p className="text-xs text-text-muted">Events</p>
                                <p className="mt-1 text-xl font-semibold text-orange">{summary.activityCount || 0}</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-dark/70 px-4 py-3">
                            <p className="text-xs text-text-muted">Current XP</p>
                            <p className="mt-1 text-2xl font-bold text-orange">{summary.xp || 0}</p>
                        </div>
                    </div>
                </article>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-text-main">Daily Volume Bars</h2>
                    <div className="mt-5 h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyActivity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                <XAxis dataKey="day" stroke="#8a8a8a" />
                                <YAxis stroke="#8a8a8a" allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="solved" fill="#ffa116" radius={[8, 8, 0, 0]} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-text-main">Difficulty Breakdown</h2>
                    <div className="mt-5 space-y-4">
                        {difficultyBreakdown.map((item) => {
                            const percent = difficultyTotal ? Math.round(((item.solved || 0) / difficultyTotal) * 100) : 0;

                            return (
                                <div key={item.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-main">{item.name}</span>
                                        <span className="text-text-muted">{item.solved || 0} solved ({percent}%)</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-light-gray">
                                        <div
                                            className={`h-2 rounded-full ${DIFFICULTY_COLORS[item.name] || "bg-orange"}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {difficultyBreakdown.length === 0 ? (
                            <p className="text-sm text-text-muted">Difficulty insights will appear after sync.</p>
                        ) : null}
                    </div>
                </article>
            </div>

            <article className="rounded-3xl border border-border bg-dark-gray p-6 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-text-main">Recent Problem Solves</h2>
                    <span className="rounded-full border border-border bg-dark px-3 py-1 text-xs text-text-muted">
                        Latest {recentActivities.length}
                    </span>
                </div>
                <div className="mt-5 space-y-4">
                    {recentActivities.length === 0 ? (
                        <p className="text-sm text-text-muted">No problem solves yet. Sync or solve a problem to populate this feed.</p>
                    ) : (
                        recentActivities.map((item, index) => (
                            <div
                                key={`${item.title}-${item.solvedAt}`}
                                className="relative rounded-xl border border-border bg-dark px-4 py-3"
                            >
                                <div className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-orange" />
                                <div className="ml-6 flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-text-main">{item.title}</p>
                                    </div>
                                    <p className="text-xs text-text-muted">
                                        {new Date(item.solvedAt).toLocaleString()}
                                    </p>
                                </div>
                                {index !== recentActivities.length - 1 ? (
                                    <div className="absolute left-5 top-8 h-8 w-px bg-border" />
                                ) : null}
                            </div>
                        ))
                    )}
                </div>
            </article>
        </section>
    );
};

export default Analytics;
