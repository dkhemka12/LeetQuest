import React from "react";
const Leaderboard = ({ users = [] }) => {
    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-text-main">Leaderboard</h2>
            <div className="mt-4 space-y-3">
                {users.length === 0 ? (
                    <p className="text-sm text-text-muted">Leaderboard data will appear here.</p>
                ) : (
                    users.map((user, index) => (
                        <div
                            key={user.username || index}
                            className="flex items-center justify-between rounded-xl bg-light-gray px-4 py-3"
                        >
                            <span className="font-medium text-text-main">
                                {index + 1}. {user.username}
                            </span>
                            <span className="text-sm text-text-muted">{user.xp} XP</span>
                        </div>
                    ))
                )}
            </div>
        </article>
    );
};

export default Leaderboard;
