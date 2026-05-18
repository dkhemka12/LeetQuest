import React from "react";
import { Link } from "react-router-dom";

const Leaderboard = ({ users = [] }) => {
    const visibleUsers = users.filter((user) => !user?.isAdmin);

    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-text-main">Leaderboard</h2>
            <div className="mt-4 space-y-3">
                {visibleUsers.length === 0 ? (
                    <p className="text-sm text-text-muted">Leaderboard data will appear here.</p>
                ) : (
                    visibleUsers.map((user, index) => (
                        <Link
                            key={user.username || index}
                            to={`/user/${user.username}`}
                            className="flex items-center justify-between rounded-xl bg-light-gray px-4 py-3 hover:bg-light-gray/80 transition-colors"
                        >
                            <span className="font-medium text-text-main">
                                {index + 1}. {user.username}
                            </span>
                            <span className="text-sm text-text-muted">{user.xp} XP</span>
                        </Link>
                    ))
                )}
            </div>
        </article>
    );
};

export default Leaderboard;
