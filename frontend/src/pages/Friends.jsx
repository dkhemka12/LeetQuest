import React from "react";
import PageHeader from "../components/PageHeader";
import FriendCard from "../components/FriendCard";
import EmptyState from "../components/EmptyState";

const Friends = () => {
    const friends = [];

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Friends"
                title="Friends skeleton"
                description="Compare XP, streaks, and activity with other users here."
            />
            {friends.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {friends.map((friend) => (
                        <FriendCard key={friend.username} friend={friend} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No friends connected"
                    description="Add friends once the friends system is ready to show comparisons here."
                />
            )}
        </section>
    );
};

export default Friends;
