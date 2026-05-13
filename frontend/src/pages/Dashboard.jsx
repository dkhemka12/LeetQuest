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
    const { user } = useAuth();
    const cardsRef = useRef(null);
    const chartsRef = useRef(null);
    const emptyStateRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dashboardData, setDashboardData] = useState(() => buildFallbackDashboard(user));

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

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Overview"
                title="Dashboard"
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
