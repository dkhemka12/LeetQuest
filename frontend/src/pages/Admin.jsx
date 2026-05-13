import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import {
    getAdminStats,
    getAllUsers,
    deleteUser,
    banUser,
    unbanUser,
    updateUser,
} from "../services/adminApi";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // view, edit, confirm

    useEffect(() => {
        loadData();
    }, [currentPage, search]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const statsRes = await getAdminStats();
            setStats(statsRes.data);

            const usersRes = await getAllUsers(currentPage, 20, search);
            setUsers(usersRes.data.users);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser._id);
            setShowModal(false);
            setSelectedUser(null);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
        }
    };

    const handleBanUser = async () => {
        if (!selectedUser) return;
        try {
            await banUser(selectedUser._id, "Banned by admin");
            setShowModal(false);
            setSelectedUser(null);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to ban user");
        }
    };

    const handleUnbanUser = async () => {
        if (!selectedUser) return;
        try {
            await unbanUser(selectedUser._id);
            setShowModal(false);
            setSelectedUser(null);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to unban user");
        }
    };

    const handlePromoteUser = async () => {
        if (!selectedUser) return;
        try {
            await updateUser(selectedUser._id, { isAdmin: true });
            setShowModal(false);
            setSelectedUser(null);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to promote user");
        }
    };

    const openUserModal = (user, mode) => {
        setSelectedUser(user);
        setModalMode(mode);
        setShowModal(true);
    };

    if (loading && !stats) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-text-muted">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <PageHeader
                eyebrow="Admin Panel"
                title="User Management"
                description="Manage users, view stats, and enforce policies"
            />

            {error && (
                <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            {stats && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <p className="text-sm text-text-muted">Total Users</p>
                        <p className="mt-2 text-4xl font-bold text-text-main">
                            {stats.stats.totalUsers}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <p className="text-sm text-text-muted">Active Users</p>
                        <p className="mt-2 text-4xl font-bold text-green">
                            {stats.stats.activeUsers}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <p className="text-sm text-text-muted">Banned Users</p>
                        <p className="mt-2 text-4xl font-bold text-red-400">
                            {stats.stats.bannedUsers}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-border bg-dark-gray p-6">
                        <p className="text-sm text-text-muted">Admin Users</p>
                        <p className="mt-2 text-4xl font-bold text-orange">
                            {stats.stats.adminUsers}
                        </p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div>
                <input
                    type="text"
                    placeholder="Search users by username or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main placeholder-text-muted outline-none focus:ring-2 focus:ring-orange/50"
                />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                    <thead className="bg-dark-gray">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-text-main">
                                Username
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-text-main">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-text-main">
                                XP
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-text-main">
                                Level
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-text-main">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-text-main">
                                Actions
                            </th>
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
                                        {user.isAdmin && (
                                            <span className="inline-flex rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange border border-orange/20">
                                                Admin
                                            </span>
                                        )}
                                        {user.isBanned && (
                                            <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
                                                Banned
                                            </span>
                                        )}
                                        {!user.isAdmin && !user.isBanned && (
                                            <span className="inline-flex rounded-full bg-green/10 px-3 py-1 text-xs font-semibold text-green border border-green/20">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openUserModal(user, "view")}
                                            className="text-xs font-medium text-orange hover:underline"
                                        >
                                            View
                                        </button>
                                        {!user.isBanned && (
                                            <button
                                                onClick={() => openUserModal(user, "ban")}
                                                className="text-xs font-medium text-red-400 hover:underline"
                                            >
                                                Ban
                                            </button>
                                        )}
                                        {user.isBanned && (
                                            <button
                                                onClick={() => openUserModal(user, "unban")}
                                                className="text-xs font-medium text-green hover:underline"
                                            >
                                                Unban
                                            </button>
                                        )}
                                        {!user.isAdmin && (
                                            <button
                                                onClick={() => openUserModal(user, "promote")}
                                                className="text-xs font-medium text-yellow hover:underline"
                                            >
                                                Promote
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openUserModal(user, "delete")}
                                            className="text-xs font-medium text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-dark-gray p-6 shadow-2xl">
                        {modalMode === "view" && (
                            <>
                                <h2 className="text-xl font-bold text-text-main mb-4">
                                    User Details
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-text-muted">Username</p>
                                        <p className="text-text-main font-medium">
                                            {selectedUser.username}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">Email</p>
                                        <p className="text-text-main font-medium">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">XP</p>
                                        <p className="text-text-main font-medium">{selectedUser.xp}</p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">Level</p>
                                        <p className="text-text-main font-medium">
                                            {selectedUser.level}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">Streak</p>
                                        <p className="text-text-main font-medium">
                                            {selectedUser.streak}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">Status</p>
                                        <p className="text-text-main font-medium">
                                            {selectedUser.isBanned
                                                ? "Banned"
                                                : selectedUser.isAdmin
                                                    ? "Admin"
                                                    : "Active"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted">Joined</p>
                                        <p className="text-text-main font-medium">
                                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mt-6 w-full rounded-xl bg-border px-4 py-2 text-text-main hover:bg-light-gray transition-colors"
                                >
                                    Close
                                </button>
                            </>
                        )}

                        {modalMode === "delete" && (
                            <>
                                <h2 className="text-xl font-bold text-red-400 mb-4">
                                    Delete User?
                                </h2>
                                <p className="text-text-muted mb-6">
                                    Are you sure you want to permanently delete{" "}
                                    <strong className="text-text-main">{selectedUser.username}</strong>
                                    ? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main hover:bg-dark transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteUser}
                                        className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}

                        {modalMode === "ban" && (
                            <>
                                <h2 className="text-xl font-bold text-yellow mb-4">Ban User?</h2>
                                <p className="text-text-muted mb-6">
                                    Ban <strong className="text-text-main">{selectedUser.username}</strong> from
                                    logging in?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main hover:bg-dark transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBanUser}
                                        className="flex-1 rounded-xl bg-yellow px-4 py-2 text-dark hover:bg-yellow/80 transition-colors font-medium"
                                    >
                                        Ban User
                                    </button>
                                </div>
                            </>
                        )}

                        {modalMode === "unban" && (
                            <>
                                <h2 className="text-xl font-bold text-green mb-4">Unban User?</h2>
                                <p className="text-text-muted mb-6">
                                    Restore login access for{" "}
                                    <strong className="text-text-main">{selectedUser.username}</strong>?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main hover:bg-dark transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUnbanUser}
                                        className="flex-1 rounded-xl bg-green px-4 py-2 text-dark hover:bg-green/80 transition-colors font-medium"
                                    >
                                        Unban User
                                    </button>
                                </div>
                            </>
                        )}

                        {modalMode === "promote" && (
                            <>
                                <h2 className="text-xl font-bold text-orange mb-4">
                                    Promote to Admin?
                                </h2>
                                <p className="text-text-muted mb-6">
                                    Grant admin privileges to{" "}
                                    <strong className="text-text-main">{selectedUser.username}</strong>?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 rounded-xl border border-border px-4 py-2 text-text-main hover:bg-dark transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePromoteUser}
                                        className="flex-1 rounded-xl bg-orange px-4 py-2 text-dark hover:bg-orange-hover transition-colors font-medium"
                                    >
                                        Promote
                                    </button>
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
