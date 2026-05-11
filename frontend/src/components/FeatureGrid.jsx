import React from "react";
import FeatureCard from "./FeatureCard";

const features = [
    {
        title: "Track streaks",
        description: "See your daily consistency at a glance and keep the chain alive.",
        icon: "🔥",
    },
    {
        title: "Earn XP and level up",
        description: "Solve problems on LeetCode and translate them into visible progress.",
        icon: "⭐",
    },
    {
        title: "Compete with friends",
        description: "Compare streaks, XP, and challenge results with people you know.",
        icon: "⚔️",
    },
];

const FeatureGrid = () => {
    return (
        <section id="features" className="border-t border-border bg-dark-gray px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} delay={index * 0.1} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;