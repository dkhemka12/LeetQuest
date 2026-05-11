import XPCard from "../components/XPCard";
import StreakCard from "../components/StreakCard";
import ProgressChart from "../components/ProgressChart";

const Dashboard = () => {
    return (
        <section className="space-y-6">
            <div>
                <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Overview</p>
                <h1 className="mt-2 text-3xl font-bold text-text-main">Dashboard skeleton</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <XPCard xp={0} level={1} />
                <StreakCard streak={0} />
            </div>

            <ProgressChart />
        </section>
    );
};

export default Dashboard;
