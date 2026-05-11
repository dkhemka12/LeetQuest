import React from "react";
import PageHeader from "../components/PageHeader";

const Analytics = () => {
    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Analytics"
                title="Analytics skeleton"
                description="Topic trends, heatmaps, and consistency charts will live here once the dashboard API is connected."
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-dark-gray p-6 text-text-muted">
                    Analytics modules will be composed from charts, summary cards, and topic breakdowns.
                </div>
                <div className="rounded-2xl border border-border bg-dark-gray p-6 text-text-muted">
                    We can place a weekly consistency chart, topic bars, and weak-area notes here.
                </div>
            </div>
        </section>
    );
};

export default Analytics;
