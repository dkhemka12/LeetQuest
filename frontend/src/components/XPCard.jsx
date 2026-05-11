import React from "react";
const XPCard = ({ xp = 0, level = 1 }) => {
    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">XP</p>
            <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-orange">{xp}</h2>
                    <p className="mt-1 text-sm text-text-muted">Current experience</p>
                </div>
                <div className="rounded-2xl bg-light-gray px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Level</p>
                    <p className="text-2xl font-semibold text-text-main">{level}</p>
                </div>
            </div>
        </article>
    );
};

export default XPCard;
