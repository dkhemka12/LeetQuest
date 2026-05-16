import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({ friend }) => {
    return (
        <Link
            to={`/user/${friend?.username}`}
            className="block rounded-2xl border border-border bg-dark-gray p-6 shadow-lg hover:border-orange hover:shadow-lg hover:shadow-orange/20 transition-all"
        >
            <h3 className="text-lg font-semibold text-text-main">{friend?.username || "Friend"}</h3>
            <p className="mt-2 text-sm text-text-muted">
                Level: {friend?.level || 1} · XP: {friend?.xp || 0}
            </p>
            <p className="mt-1 text-sm text-text-muted">
                Streak: {friend?.streak || 0} days
            </p>
        </Link>
    );
};

export default FriendCard;
