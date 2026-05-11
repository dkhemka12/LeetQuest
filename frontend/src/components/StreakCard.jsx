const StreakCard = ({ streak = 0 }) => {
    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Streak</p>
            <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-yellow">{streak} days</h2>
                    <p className="mt-1 text-sm text-text-muted">Keep the chain alive</p>
                </div>
                <div className="rounded-full bg-light-gray px-4 py-3 text-3xl">🔥</div>
            </div>
        </article>
    );
};

export default StreakCard;
