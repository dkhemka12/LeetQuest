import React from "react";
import { Link } from "react-router-dom";

const FriendCard = ({
    friend,
    actionLabel,
    onAction,
    actionLoading = false,
    secondaryActionLabel,
    onSecondaryAction,
    secondaryActionLoading = false,
}) => {
    const displayName = friend?.firstName || friend?.lastName
        ? `${friend?.firstName || ""}${friend?.firstName && friend?.lastName ? " " : ""}${friend?.lastName || ""}`.trim()
        : friend?.username || "Friend";

    const content = (
        <>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-text-main">{displayName}</h3>
                    <p className="text-sm text-text-muted">@{friend?.username || "friend"}</p>
                </div>
            </div>
            <p className="mt-4 text-sm text-text-muted">
                Level {friend?.level || 1} · {friend?.xp || 0} XP · {friend?.streak || 0} day streak
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text-muted/80">
                Consistency {friend?.consistencyScore || 0}%
            </p>
            {onAction || onSecondaryAction ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {onAction ? (
                        <button
                            type="button"
                            onClick={onAction}
                            disabled={actionLoading}
                            className="rounded-full bg-orange px-3 py-1.5 text-xs font-semibold text-dark transition-all hover:bg-orange/90 disabled:opacity-60"
                        >
                            {actionLoading ? "Working..." : actionLabel || "Action"}
                        </button>
                    ) : null}
                    {onSecondaryAction ? (
                        <button
                            type="button"
                            onClick={onSecondaryAction}
                            disabled={secondaryActionLoading}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-orange hover:text-orange disabled:opacity-60"
                        >
                            {secondaryActionLoading ? "Working..." : secondaryActionLabel || "Secondary"}
                        </button>
                    ) : null}
                </div>
            ) : null}
        </>
    );

    if (onAction) {
        return (
            <div className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg transition-all hover:border-orange hover:shadow-lg hover:shadow-orange/20">
                {content}
            </div>
        );
    }

    return (
        <Link
            to={`/user/${friend?.username}`}
            className="block rounded-2xl border border-border bg-dark-gray p-6 shadow-lg transition-all hover:border-orange hover:shadow-lg hover:shadow-orange/20"
        >
            {content}
        </Link>
    );
};

export default FriendCard;
