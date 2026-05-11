import React from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const Profile = () => {
    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Profile"
                title="Profile skeleton"
                description="This page will eventually handle account settings, LeetCode username changes, and badge display."
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border bg-dark-gray p-6 text-text-muted">
                    User settings and LeetCode connection details will live here.
                </div>
                <EmptyState
                    title="Badges and progress"
                    description="We can render the unlocked badge list and profile stats beside the settings panel."
                />
            </div>
        </section>
    );
};

export default Profile;
