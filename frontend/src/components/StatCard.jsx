import React from "react";
const StatCard = ({ label, value, detail, tone = "orange" }) => {
    const toneClasses = {
        orange: "text-orange",
        yellow: "text-yellow",
        green: "text-green",
        red: "text-red",
    };

    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">{label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
                <h3 className={`text-4xl font-bold ${toneClasses[tone] || toneClasses.orange}`}>
                    {value}
                </h3>
            </div>
            {detail ? <p className="mt-2 text-sm text-text-muted">{detail}</p> : null}
        </article>
    );
};

export default StatCard;