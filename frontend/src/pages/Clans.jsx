import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import {
    createClan,
    getClans,
    getMyClan,
    joinClan,
    leaveClan,
    postClanTownhallMessage,
} from "../services/userApi";

const blankClanForm = { name: "", inviteCode: "" };

const Clans = () => {
    const { user } = useAuth();
    const [myClan, setMyClan] = useState(null);
    const [clans, setClans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyKey, setBusyKey] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [clanForm, setClanForm] = useState(blankClanForm);
    const [townhallDraft, setTownhallDraft] = useState("");
    const [clanOpen, setClanOpen] = useState(true);

    const displayName = user?.firstName
        ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
        : user?.username || "there";

    const loadClanData = async () => {
        setLoading(true);
        setError("");

        try {
            const [nextClans, nextMyClan] = await Promise.all([getClans(), getMyClan()]);
            setClans(nextClans);
            setMyClan(nextMyClan);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load clans right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClanData();
    }, []);

    const refreshClanData = async () => {
        const [nextClans, nextMyClan] = await Promise.all([getClans(), getMyClan()]);
        setClans(nextClans);
        setMyClan(nextMyClan);
    };

    const copyInvite = async () => {
        if (!myClan) {
            return;
        }

        const inviteText = `Join my clan ${myClan.name}. Invite code: ${myClan.inviteCode}`;

        try {
            await navigator.clipboard?.writeText(inviteText);
            setMessage("Clan invite copied.");
        } catch {
            setMessage(inviteText);
        }
    };

    const handleCreateClan = async (event) => {
        event.preventDefault();

        const name = clanForm.name.trim();
        if (!name) {
            setError("Enter a clan name before creating one.");
            return;
        }

        setBusyKey("create-clan");
        setMessage("");
        setError("");

        try {
            await createClan(name);
            setClanForm(blankClanForm);
            setClanOpen(true);
            setMessage(`Clan "${name}" created.`);
            await refreshClanData();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create clan.");
        } finally {
            setBusyKey("");
        }
    };

    const handleJoinClan = async (event) => {
        event.preventDefault();

        const inviteCode = clanForm.inviteCode.trim();
        if (!inviteCode) {
            setError("Enter an invite code to join a clan.");
            return;
        }

        setBusyKey("join-clan");
        setMessage("");
        setError("");

        try {
            await joinClan(inviteCode);
            setClanForm(blankClanForm);
            setClanOpen(true);
            setMessage(`Joined clan ${inviteCode.toUpperCase()}.`);
            await refreshClanData();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to join clan.");
        } finally {
            setBusyKey("");
        }
    };

    const handleLeaveClan = async () => {
        if (!myClan?._id) {
            return;
        }

        setBusyKey(`leave-clan-${myClan._id}`);
        setMessage("");
        setError("");

        try {
            await leaveClan(myClan._id);
            setMessage("You left your clan.");
            setClanOpen(false);
            await refreshClanData();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to leave clan.");
        } finally {
            setBusyKey("");
        }
    };

    const handleTownhallPost = async (event) => {
        event.preventDefault();

        const body = townhallDraft.trim();
        if (!body || !myClan?._id) {
            return;
        }

        setBusyKey("townhall-post");
        setMessage("");
        setError("");

        try {
            await postClanTownhallMessage(myClan._id, body);
            setTownhallDraft("");
            setMessage("Townhall message posted.");
            await refreshClanData();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to post to townhall.");
        } finally {
            setBusyKey("");
        }
    };

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Clans"
                title={`Clan room, ${displayName}`}
                description="Create a clan, join with an invite code, post to the townhall, and compare clan rankings here."
            />

            <section className="space-y-6 rounded-3xl border border-border bg-dark-gray/90 p-6 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Clan control</p>
                        <h2 className="mt-2 text-2xl font-bold text-text-main">Your clan room</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setClanOpen((value) => !value)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-orange hover:text-orange"
                    >
                        {clanOpen ? "Hide room" : "Open room"}
                    </button>
                </div>

                {message ? <p className="text-sm text-green-400">{message}</p> : null}
                {error ? <p className="text-sm text-red-400">{error}</p> : null}

                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-4">
                        <form className="space-y-3" onSubmit={handleCreateClan}>
                            <label className="block text-xs uppercase tracking-[0.2em] text-text-muted">Create clan</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={clanForm.name}
                                    onChange={(event) => setClanForm({ ...clanForm, name: event.target.value })}
                                    placeholder="Clan name"
                                    className="flex-1 rounded-xl border border-border bg-dark px-4 py-3 text-sm text-text-main outline-none focus:border-orange focus:ring-1 focus:ring-orange/30"
                                />
                                <button
                                    type="submit"
                                    disabled={busyKey === "create-clan"}
                                    className="rounded-xl bg-orange px-4 py-3 text-sm font-semibold text-dark transition-colors hover:bg-orange/90 disabled:opacity-60"
                                >
                                    {busyKey === "create-clan" ? "Creating" : "Create"}
                                </button>
                            </div>
                        </form>

                        <form className="space-y-3" onSubmit={handleJoinClan}>
                            <label className="block text-xs uppercase tracking-[0.2em] text-text-muted">Join with invite code</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={clanForm.inviteCode}
                                    onChange={(event) => setClanForm({ ...clanForm, inviteCode: event.target.value })}
                                    placeholder="Invite code"
                                    className="flex-1 rounded-xl border border-border bg-dark px-4 py-3 text-sm uppercase tracking-[0.2em] text-text-main outline-none focus:border-orange focus:ring-1 focus:ring-orange/30"
                                />
                                <button
                                    type="submit"
                                    disabled={busyKey === "join-clan"}
                                    className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-text-main transition-colors hover:border-orange hover:text-orange disabled:opacity-60"
                                >
                                    {busyKey === "join-clan" ? "Joining" : "Join"}
                                </button>
                            </div>
                        </form>

                        {myClan ? (
                            <div className="rounded-2xl border border-orange/20 bg-orange/10 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-orange">Your clan</p>
                                        <h3 className="mt-2 text-lg font-semibold text-text-main">{myClan.name}</h3>
                                        <p className="mt-1 text-sm text-text-muted">
                                            Score {myClan.score || 0} · {myClan.memberCount || 0} members
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLeaveClan}
                                        disabled={busyKey === `leave-clan-${myClan._id}`}
                                        className="rounded-full border border-orange/30 bg-dark/60 px-3 py-1.5 text-xs font-semibold text-orange transition-colors hover:bg-orange/10 disabled:opacity-60"
                                    >
                                        {busyKey === `leave-clan-${myClan._id}` ? "Leaving" : "Leave"}
                                    </button>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
                                    <span>Invite code</span>
                                    <span className="font-mono tracking-[0.25em] text-text-main">{myClan.inviteCode}</span>
                                    <button
                                        type="button"
                                        onClick={copyInvite}
                                        className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-muted transition-colors hover:border-orange hover:text-orange"
                                    >
                                        Copy invite
                                    </button>
                                </div>
                                <Link
                                    to="/friends"
                                    className="mt-4 inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-orange hover:text-orange"
                                >
                                    Back to friends
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border bg-dark/50 p-4 text-sm text-text-muted">
                                Create or join a clan to unlock the room and townhall.
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {clanOpen && myClan ? (
                            <div className="space-y-4 rounded-2xl border border-border bg-dark/70 p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Townhall</p>
                                        <h3 className="mt-1 text-lg font-semibold text-text-main">Message everyone</h3>
                                    </div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                                        {myClan.messages?.length || 0} posts
                                    </p>
                                </div>

                                <form className="space-y-3" onSubmit={handleTownhallPost}>
                                    <textarea
                                        value={townhallDraft}
                                        onChange={(event) => setTownhallDraft(event.target.value)}
                                        rows={3}
                                        placeholder="Post an update, challenge, or reminder to the whole clan..."
                                        className="w-full rounded-2xl border border-border bg-dark px-4 py-3 text-sm text-text-main outline-none focus:border-orange focus:ring-1 focus:ring-orange/30"
                                    />
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs text-text-muted">This acts like your clan townhall.</p>
                                        <button
                                            type="submit"
                                            disabled={busyKey === "townhall-post" || !townhallDraft.trim()}
                                            className="rounded-xl bg-orange px-4 py-2 text-sm font-semibold text-dark transition-colors hover:bg-orange/90 disabled:opacity-60"
                                        >
                                            {busyKey === "townhall-post" ? "Posting" : "Post"}
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-3">
                                    {(myClan.messages || []).length > 0 ? (
                                        myClan.messages.map((post) => (
                                            <div key={`${post._id || post.createdAt}-${post.body}`} className="rounded-2xl border border-white/5 bg-dark-gray p-3">
                                                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-text-muted">
                                                    <span>{post.author?.username || "member"}</span>
                                                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "now"}</span>
                                                </div>
                                                <p className="mt-2 text-sm leading-6 text-text-main">{post.body}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState
                                            title="Townhall is empty"
                                            description="Post the first clan announcement or challenge to get everyone talking."
                                        />
                                    )}
                                </div>
                            </div>
                        ) : null}

                        <div className="rounded-2xl border border-border bg-dark/70 p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Clan leaderboard</p>
                                    <h3 className="mt-1 text-lg font-semibold text-text-main">Current rankings</h3>
                                </div>
                                <p className="text-sm text-text-muted">{clans.length} clans</p>
                            </div>

                            <div className="mt-4 space-y-3">
                                {loading ? (
                                    <p className="text-sm text-text-muted">Loading clans...</p>
                                ) : clans.length > 0 ? (
                                    clans.map((clan, index) => (
                                        <div
                                            key={clan._id}
                                            className={`rounded-2xl border p-4 ${clan.isMine ? "border-orange/40 bg-orange/10" : "border-border bg-dark/50"}`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted">#{index + 1}</p>
                                                    <h4 className="mt-2 text-base font-semibold text-text-main">{clan.name}</h4>
                                                    <p className="mt-1 text-sm text-text-muted">
                                                        {clan.memberCount || 0} members · Owner {clan.owner?.username || "unknown"}
                                                    </p>
                                                </div>
                                                <p className="text-lg font-semibold text-orange">{clan.score || 0}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        title="No clans yet"
                                        description="Create the first clan and start a leaderboard people can actually chase."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Clans;