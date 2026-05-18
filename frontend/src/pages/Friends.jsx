import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import FriendCard from "../components/FriendCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { addFriend, getUserFriends, removeFriend, searchUsers } from "../services/userApi";

const Friends = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [busyKey, setBusyKey] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const friendIds = useMemo(() => new Set(friends.map((friend) => String(friend?._id))), [friends]);

    const displayName = user?.firstName
        ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
        : user?.username || "there";

    const loadFriends = async () => {
        setLoading(true);
        setError("");

        try {
            const nextFriends = await getUserFriends();
            setFriends(nextFriends);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load friends right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFriends();
    }, []);

    const refreshFriends = async () => {
        const nextFriends = await getUserFriends();
        setFriends(nextFriends);
    };

    const runSearch = async (event) => {
        event.preventDefault();

        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        setMessage("");
        setError("");

        try {
            const results = await searchUsers(trimmedQuery, 12);
            setSearchResults(results);
            setMessage(results.length === 0 ? `No users found for "${trimmedQuery}".` : "");
        } catch (err) {
            setError(err.response?.data?.message || "Search failed. Try again.");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleFriendAction = async (friendId, action) => {
        const key = `${action}-${friendId}`;
        setBusyKey(key);
        setMessage("");
        setError("");

        try {
            if (action === "add") {
                await addFriend(friendId);
                setMessage("Friend added.");
            } else {
                await removeFriend(friendId);
                setMessage("Friend removed.");
            }

            await refreshFriends();

            if (searchQuery.trim()) {
                const results = await searchUsers(searchQuery.trim(), 12);
                setSearchResults(results);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update friend list.");
        } finally {
            setBusyKey("");
        }
    };

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Friends"
                title={`Build a crew, ${displayName}`}
                description="Search users, add friends, and manage your social circle here. Clan tools now live on a separate page."
            />

            <section className="rounded-3xl border border-border bg-dark-gray/90 p-6 shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Find users</p>
                        <h2 className="mt-2 text-2xl font-bold text-text-main">Search the community</h2>
                        <p className="mt-2 max-w-2xl text-sm text-text-muted">
                            Search by username, real name, or LeetCode handle. Add people to keep your practice circle growing.
                        </p>
                    </div>
                    <form className="flex w-full gap-3 md:max-w-xl" onSubmit={runSearch}>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by username or name"
                            className="flex-1 rounded-xl border border-border bg-dark px-4 py-3 text-sm text-text-main outline-none transition-colors focus:border-orange focus:ring-1 focus:ring-orange/30"
                        />
                        <button
                            type="submit"
                            disabled={searchLoading}
                            className="rounded-xl bg-orange px-5 py-3 text-sm font-semibold text-dark transition-all hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {searchLoading ? "Searching" : "Search"}
                        </button>
                    </form>
                </div>

                {message ? <p className="mt-4 text-sm text-green-400">{message}</p> : null}
                {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => {
                            const isFriend = friendIds.has(String(result._id));
                            const action = isFriend ? "remove" : "add";

                            return (
                                <FriendCard
                                    key={result._id}
                                    friend={result}
                                    actionLabel={isFriend ? "Remove" : "Add friend"}
                                    onAction={() => handleFriendAction(result._id, action)}
                                    actionLoading={busyKey === `${action}-${result._id}`}
                                />
                            );
                        })
                    ) : (
                        <div className="md:col-span-2 xl:col-span-3">
                            <EmptyState
                                title="No search results yet"
                                description="Try a username, LeetCode handle, or teammate name to start building your circle."
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-3xl border border-border bg-dark-gray/90 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Clan room</p>
                        <h2 className="mt-2 text-2xl font-bold text-text-main">Open clans in a separate page</h2>
                        <p className="mt-2 max-w-2xl text-sm text-text-muted">
                            Clan tools, townhall chat, and clan ranking are now isolated so Friends stays focused.
                        </p>
                    </div>
                    <Link
                        to="/clans"
                        className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-dark transition-colors hover:bg-orange/90"
                    >
                        Go to clans
                    </Link>
                </div>
            </section>

            <section className="rounded-3xl border border-border bg-dark-gray/90 p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Friends</p>
                        <h2 className="mt-2 text-2xl font-bold text-text-main">Your competitive circle</h2>
                    </div>
                    <p className="text-sm text-text-muted">{friends.length} friends connected</p>
                </div>

                {loading ? <p className="mt-6 text-sm text-text-muted">Loading your network...</p> : null}

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <FriendCard
                                key={friend._id}
                                friend={friend}
                                actionLabel="Remove"
                                onAction={() => handleFriendAction(friend._id, "remove")}
                                actionLoading={busyKey === `remove-${friend._id}`}
                            />
                        ))
                    ) : (
                        <div className="md:col-span-2 xl:col-span-3">
                            <EmptyState
                                title="No friends connected"
                                description="Search for people above, then add them to start comparing streaks, XP, and consistency."
                            />
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
};

export default Friends;