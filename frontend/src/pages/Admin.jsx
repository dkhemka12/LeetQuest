import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
    banUser,
    createAdminChallenge,
    deleteAdminChallenge,
    deleteUser,
    getAdminChallenges,
    getAllUsers,
    unbanUser,
    updateAdminChallenge,
    updateUser,
} from "../services/adminApi";

const tabs = ["overview", "users", "challenges"];
const challengeTopics = [
    "Array",
    "Strings",
    "Hash Table",
    "Linked List",
    "Stack",
    "Queue",
    "Tree",
    "Graph",
    "Dynamic Programming",
    "Binary Search",
    "Greedy",
    "Sliding Window",
    "Two Pointers",
    "Backtracking",
];
const difficultyOptions = ["Easy", "Medium", "Hard"];

const getSectionFromPath = (pathname) => {
    if (pathname.includes("/admin/challenges")) return "challenges";
    if (pathname.includes("/admin/users")) return "users";
    return "overview";
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(getSectionFromPath(location.pathname));
    const [users, setUsers] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [busyId, setBusyId] = useState("");
    const [challengeForm, setChallengeForm] = useState({
        title: "",
        description: "",
        topic: "Array",
        difficulty: "Easy",
        targetQuestions: 1,
        deadline: "",
        type: "custom",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [usersRes, challengesRes] = await Promise.all([
                getAllUsers(currentPage, 20, search),
                getAdminChallenges(),
            ]);

            setUsers(usersRes.data.users || []);
            setChallenges(challengesRes.data.challenges || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [currentPage, search]);

    useEffect(() => {
        setActiveTab(getSectionFromPath(location.pathname));
    }, [location.pathname]);

    const stats = useMemo(() => ({
        totalUsers: users.length,
        totalChallenges: challenges.length,
        activeChallenges: challenges.filter((challenge) => challenge.status === "open" || challenge.status === "active").length,
        dailyChallenges: challenges.filter((challenge) => challenge.type === "daily").length,
        adminUsers: users.filter((user) => user.isAdmin).length,
        bannedUsers: users.filter((user) => user.isBanned).length,
    }), [users, challenges]);

    const openUserModal = (user, mode) => {
        setSelectedUser(user);
        setModalMode(mode);
        setShowModal(true);
    };

    const mutateUser = async (action) => {
        if (!selectedUser) return;

        try {
            setBusyId(selectedUser._id);
            await action();
            setShowModal(false);
            setSelectedUser(null);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user");
        } finally {
            setBusyId("");
        }
    };

    const handleCreateChallenge = async (event) => {
        event.preventDefault();

        try {
            setBusyId("create-challenge");
            const created = await createAdminChallenge({
                ...challengeForm,
                topics: [challengeForm.topic],
                targetQuestions: Number(challengeForm.targetQuestions || 1),
                deadline: challengeForm.deadline || null,
            });
            setChallenges((current) => [created.data?.challenge || created, ...current]);
            setChallengeForm({
                title: "",
                description: "",
                topic: "Array",
                difficulty: "Easy",
                targetQuestions: 1,
                deadline: "",
                type: "custom",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create challenge");
        } finally {
            setBusyId("");
        }
    };

    const handleUpdateChallenge = async (challengeId, payload) => {
        try {
            setBusyId(challengeId);
            const updated = await updateAdminChallenge(challengeId, payload);
            const nextChallenge = updated.data?.challenge || updated;
            setChallenges((current) =>
                current.map((challenge) =>
                    challenge._id === challengeId ? nextChallenge : challenge,
                ),
            );
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update challenge");
        } finally {
            setBusyId("");
        }
    };

    const handleDeleteChallenge = async (challengeId) => {
        try {
            setBusyId(challengeId);
            await deleteAdminChallenge(challengeId);
            setChallenges((current) => current.filter((challenge) => challenge._id !== challengeId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete challenge");
        } finally {
            setBusyId("");
        }
    };

    const goToSection = (section) => {
        setActiveTab(section);
        if (section === "overview") {
            navigate("/admin");
            return;
        }
        navigate(`/admin/${section}`);
    };

    const recentUsers = users.slice(0, 6);
    const recentChallenges = challenges.slice(0, 6);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-text-muted">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="rounded-4xl border border-border bg-linear-to-b from-dark-gray via-dark-gray to-dark p-6 shadow-2xl shadow-black/20 lg:sticky lg:top-6 lg:self-start">
                    <div className="space-y-5">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-orange">Admin Dashboard</p>
                            <h1 className="mt-2 text-3xl font-bold text-text-main">Control room</h1>
                            <p className="mt-3 text-sm leading-6 text-text-muted">
                                Manage users and challenges from a dedicated admin workspace.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-border bg-dark p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Users</p>
                                <p className="mt-2 text-2xl font-bold text-text-main">{stats.totalUsers}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-dark p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Challenges</p>
                                <p className="mt-2 text-2xl font-bold text-orange">{stats.totalChallenges}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => goToSection(tab)}
                                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${activeTab === tab
                                        ? "border-orange bg-orange/10 text-orange"
                                        : "border-border bg-dark text-text-main hover:border-orange hover:text-orange"
                                        }`}
                                >
                                    <span className="capitalize">{tab}</span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
                                        {tab === "overview" ? "summary" : tab}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-border bg-dark p-4 text-sm text-text-muted">
                            <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Focus</p>
                            <p className="mt-2 text-text-main">
                                No analytics, no player clutter, no shared screen with regular users.
                            </p>
                        </div>
                    </div>
                </aside>

                <div className="space-y-6">
                    {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                                    <p className="text-sm text-text-muted">Active Challenges</p>
                                    <p className="mt-2 text-3xl font-bold text-green">{stats.activeChallenges}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                                    <p className="text-sm text-text-muted">Daily Challenges</p>
                                    <p className="mt-2 text-3xl font-bold text-yellow">{stats.dailyChallenges}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                                    <p className="text-sm text-text-muted">Admins</p>
                                    <p className="mt-2 text-3xl font-bold text-orange">{stats.adminUsers}</p>
                                </div>
                                <div className="rounded-2xl border border-border bg-dark-gray p-6">
                                    <p className="text-sm text-text-muted">Banned</p>
                                    <p className="mt-2 text-3xl font-bold text-red-400">{stats.bannedUsers}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="rounded-[1.75rem] border border-border bg-dark-gray p-6">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Recent users</p>
                                            <h2 className="mt-1 text-2xl font-bold text-text-main">Latest accounts</h2>
                                        </div>
                                        <button onClick={() => goToSection("users")} className="rounded-full border border-border px-4 py-2 text-sm text-text-main hover:border-orange hover:text-orange">
                                            Open users
                                        </button>
                                    </div>
                                    <div className="mt-5 space-y-3">
                                        {recentUsers.map((recentUser) => (
                                            <div key={recentUser._id} className="flex items-center justify-between rounded-xl border border-border bg-dark px-4 py-3 text-sm">
                                                <div>
                                                    <p className="font-semibold text-text-main">{recentUser.username}</p>
                                                    <p className="text-text-muted">{recentUser.email}</p>
                                                </div>
                                                <span className="text-text-muted">{recentUser.isAdmin ? "Admin" : "Player"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[1.75rem] border border-border bg-dark-gray p-6">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Recent challenges</p>
                                            <h2 className="mt-1 text-2xl font-bold text-text-main">Latest prompts</h2>
                                        </div>
                                        <button onClick={() => goToSection("challenges")} className="rounded-full border border-border px-4 py-2 text-sm text-text-main hover:border-orange hover:text-orange">
                                            Open challenges
                                        </button>
                                    </div>
                                    <div className="mt-5 space-y-3">
                                        {recentChallenges.map((challenge) => (
                                            <div key={challenge._id} className="rounded-xl border border-border bg-dark px-4 py-3 text-sm">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-text-main">{challenge.title}</p>
                                                        <p className="text-text-muted">{challenge.topic} · {challenge.difficulty}</p>
                                                    </div>
                                                    <span className="rounded-full bg-light-gray px-3 py-1 text-xs text-text-muted">{challenge.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-6 rounded-[1.75rem] border border-border bg-dark-gray p-6 shadow-xl shadow-black/10">
                            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">User management</p>
                                    <h2 className="mt-1 text-2xl font-bold text-text-main">Moderate the player base</h2>
                                </div>
                                <p className="text-sm text-text-muted">Search, ban, promote, or remove users.</p>
                            </div>
                            <input
                                type="text"
                                placeholder="Search users by username or email..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main placeholder-text-muted outline-none focus:ring-2 focus:ring-orange/50"
                            />

                            <div className="overflow-x-auto rounded-2xl border border-border">
                                <table className="w-full text-sm">
                                    <thead className="bg-dark-gray">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold text-text-main">Username</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-main">Email</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-main">XP</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-main">Level</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-main">Status</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-main">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-dark-gray/50">
                                                <td className="px-6 py-4 text-text-main">{user.username}</td>
                                                <td className="px-6 py-4 text-text-muted">{user.email}</td>
                                                <td className="px-6 py-4 text-text-main">{user.xp}</td>
                                                <td className="px-6 py-4 text-text-main">{user.level}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {user.isAdmin && <span className="inline-flex rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange border border-orange/20">Admin</span>}
                                                        {user.isBanned && <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/20">Banned</span>}
                                                        {!user.isAdmin && !user.isBanned && <span className="inline-flex rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green border border-green/20">Active</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button onClick={() => openUserModal(user, "view")} className="text-xs font-medium text-orange hover:underline">View</button>
                                                        {!user.isBanned && <button onClick={() => openUserModal(user, "ban")} className="text-xs font-medium text-red-400 hover:underline">Ban</button>}
                                                        {user.isBanned && <button onClick={() => openUserModal(user, "unban")} className="text-xs font-medium text-green hover:underline">Unban</button>}
                                                        {!user.isAdmin && <button onClick={() => openUserModal(user, "promote")} className="text-xs font-medium text-yellow hover:underline">Promote</button>}
                                                        <button onClick={() => openUserModal(user, "delete")} className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "challenges" && (
                        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                            <form onSubmit={handleCreateChallenge} className="rounded-4xl border border-border bg-linear-to-b from-dark-gray to-dark p-6 shadow-xl shadow-black/10">
                                <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Challenge Studio</p>
                                <h2 className="mt-2 text-2xl font-bold text-text-main">Create challenge prompts</h2>
                                <p className="mt-2 text-sm text-text-muted">Keep this section focused on challenge ops only.</p>
                                <div className="mt-5 space-y-3">
                                    <input
                                        type="text"
                                        value={challengeForm.title}
                                        onChange={(event) => setChallengeForm((current) => ({ ...current, title: event.target.value }))}
                                        placeholder="Title"
                                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none focus:border-orange"
                                    />
                                    <textarea
                                        rows="4"
                                        value={challengeForm.description}
                                        onChange={(event) => setChallengeForm((current) => ({ ...current, description: event.target.value }))}
                                        placeholder="Description"
                                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none focus:border-orange"
                                    />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            value={challengeForm.topic}
                                            onChange={(event) => setChallengeForm((current) => ({ ...current, topic: event.target.value }))}
                                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none focus:border-orange"
                                        >
                                            {challengeTopics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                                        </select>
                                        <select
                                            value={challengeForm.difficulty}
                                            onChange={(event) => setChallengeForm((current) => ({ ...current, difficulty: event.target.value }))}
                                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none focus:border-orange"
                                        >
                                            {difficultyOptions.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
                                        </select>
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        value={challengeForm.targetQuestions}
                                        onChange={(event) => setChallengeForm((current) => ({ ...current, targetQuestions: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none focus:border-orange"
                                    />
                                    <input
                                        type="datetime-local"
                                        value={challengeForm.deadline}
                                        onChange={(event) => setChallengeForm((current) => ({ ...current, deadline: event.target.value }))}
                                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none focus:border-orange"
                                    />
                                    <button
                                        type="submit"
                                        disabled={busyId === "create-challenge"}
                                        className="w-full rounded-xl bg-orange px-4 py-3 font-semibold text-dark transition-colors hover:bg-orange-hover disabled:opacity-60"
                                    >
                                        {busyId === "create-challenge" ? "Creating..." : "Create challenge"}
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4">
                                <div className="rounded-[1.75rem] border border-border bg-dark-gray p-5">
                                    <h3 className="text-lg font-semibold text-text-main">Existing challenges</h3>
                                    <p className="mt-1 text-sm text-text-muted">Open, complete, or delete existing challenge records.</p>
                                </div>
                                {challenges.map((challenge) => (
                                    <article key={challenge._id} className="rounded-2xl border border-border bg-dark-gray p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-text-main">{challenge.title}</h3>
                                                <p className="mt-1 text-sm text-text-muted">{challenge.description}</p>
                                            </div>
                                            <span className="rounded-full bg-light-gray px-3 py-1 text-xs text-text-muted">{challenge.status}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                            <span className="rounded-full bg-orange/10 px-3 py-1 text-orange">{challenge.topic}</span>
                                            <span className="rounded-full bg-green/10 px-3 py-1 text-green">{challenge.difficulty}</span>
                                            <span className="rounded-full bg-light-gray px-3 py-1 text-text-muted">{challenge.type}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleUpdateChallenge(challenge._id, { status: challenge.status === "completed" ? "open" : "completed" })}
                                                disabled={busyId === challenge._id}
                                                className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-main hover:border-orange hover:text-orange disabled:opacity-60"
                                            >
                                                Toggle complete
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChallenge(challenge._id)}
                                                disabled={busyId === challenge._id}
                                                className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-60"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-dark-gray p-6 shadow-2xl">
                        {modalMode === "view" && (
                            <>
                                <h2 className="mb-4 text-xl font-bold text-text-main">User Details</h2>
                                <div className="space-y-3 text-sm">
                                    <div><p className="text-text-muted">Username</p><p className="font-medium text-text-main">{selectedUser.username}</p></div>
                                    <div><p className="text-text-muted">Email</p><p className="font-medium text-text-main">{selectedUser.email}</p></div>
                                    <div><p className="text-text-muted">XP</p><p className="font-medium text-text-main">{selectedUser.xp}</p></div>
                                    <div><p className="text-text-muted">Level</p><p className="font-medium text-text-main">{selectedUser.level}</p></div>
                                    <div><p className="text-text-muted">Streak</p><p className="font-medium text-text-main">{selectedUser.streak}</p></div>
                                    <div><p className="text-text-muted">Status</p><p className="font-medium text-text-main">{selectedUser.isBanned ? "Banned" : selectedUser.isAdmin ? "Admin" : "Active"}</p></div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="mt-6 w-full rounded-xl bg-border px-4 py-2 text-text-main hover:bg-light-gray">Close</button>
                            </>
                        )}

                        {modalMode === "delete" && (
                            <>
                                <h2 className="mb-4 text-xl font-bold text-red-400">Delete user?</h2>
                                <p className="mb-6 text-text-muted">This will permanently remove <strong className="text-text-main">{selectedUser.username}</strong>.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main">Cancel</button>
                                    <button onClick={() => mutateUser(() => deleteUser(selectedUser._id))} disabled={busyId === selectedUser._id} className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-medium text-white disabled:opacity-60">Delete</button>
                                </div>
                            </>
                        )}

                        {modalMode === "ban" && (
                            <>
                                <h2 className="mb-4 text-xl font-bold text-yellow">Ban user?</h2>
                                <p className="mb-6 text-text-muted">Block <strong className="text-text-main">{selectedUser.username}</strong> from logging in.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main">Cancel</button>
                                    <button onClick={() => mutateUser(() => banUser(selectedUser._id, "Banned by admin"))} disabled={busyId === selectedUser._id} className="flex-1 rounded-xl bg-yellow px-4 py-2 font-medium text-dark disabled:opacity-60">Ban</button>
                                </div>
                            </>
                        )}

                        {modalMode === "unban" && (
                            <>
                                <h2 className="mb-4 text-xl font-bold text-green">Unban user?</h2>
                                <p className="mb-6 text-text-muted">Restore login access for <strong className="text-text-main">{selectedUser.username}</strong>.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main">Cancel</button>
                                    <button onClick={() => mutateUser(() => unbanUser(selectedUser._id))} disabled={busyId === selectedUser._id} className="flex-1 rounded-xl bg-green px-4 py-2 font-medium text-dark disabled:opacity-60">Unban</button>
                                </div>
                            </>
                        )}

                        {modalMode === "promote" && (
                            <>
                                <h2 className="mb-4 text-xl font-bold text-orange">Promote to admin?</h2>
                                <p className="mb-6 text-text-muted">Grant admin privileges to <strong className="text-text-main">{selectedUser.username}</strong>.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main">Cancel</button>
                                    <button onClick={() => mutateUser(() => updateUser(selectedUser._id, { isAdmin: true }))} disabled={busyId === selectedUser._id} className="flex-1 rounded-xl bg-orange px-4 py-2 font-medium text-dark disabled:opacity-60">Promote</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminDashboard;
