const FriendCard = ({ friend }) => {
    return (
        <article className="rounded-2xl border border-border bg-dark-gray p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-text-main">{friend?.username || "Friend"}</h3>
            <p className="mt-2 text-sm text-text-muted">
                Streak: {friend?.streak || 0} days · XP: {friend?.xp || 0}
            </p>
        </article>
    );
};

export default FriendCard;
