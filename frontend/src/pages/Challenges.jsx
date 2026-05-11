import React from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const Challenges = () => {
    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Challenges"
                title="Challenges skeleton"
                description="We’ll use this space for friend challenges, deadlines, topic targets, and winner tracking."
            />
            <EmptyState
                title="No active challenges"
                description="Create a challenge to compare progress with a friend or group."
            />
        </section>
    );
};

export default Challenges;
