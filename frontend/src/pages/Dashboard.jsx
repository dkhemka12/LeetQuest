import React from "react";
import XPCard from "../components/XPCard";
import StreakCard from "../components/StreakCard";
import ProgressChart from "../components/ProgressChart";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Leaderboard from "../components/Leaderboard";
import EmptyState from "../components/EmptyState";

const Dashboard = () => {
    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Overview"
                title="Dashboard skeleton"
                description="This is the first pass of the dashboard layout. We will plug live stats, streak data, and LeetCode sync results into these cards next."
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Solved" value="0" detail="Problems synced from LeetCode" tone="green" />
                <StatCard label="Consistency" value="0%" detail="Your activity momentum" tone="yellow" />
                <XPCard xp={0} level={1} />
                <StreakCard streak={0} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <ProgressChart />
                <Leaderboard />
            </div>

            <EmptyState
                title="No activity synced yet"
                description="Once a LeetCode username is connected, this area can show recent submissions, weak topics, and badges."
            />
        </section>
    );
};

export default Dashboard;
