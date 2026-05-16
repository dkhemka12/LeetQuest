import React, { useState, useEffect } from "react";
import { FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import { getUserActivityHistory, formatTimeAgo } from "../services/userApi";

const difficultyColors = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500",
};

const PAGE_SIZE = 20;

const History = () => {
    const [activities, setActivities] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadHistory(1);
    }, []);

    const loadHistory = async (page) => {
        try {
            setLoading(true);
            setError("");
            const data = await getUserActivityHistory(page, PAGE_SIZE);
            console.log("Activity history data:", data);
            setActivities(Array.isArray(data.activities) ? data.activities : []);
            setPagination(data.pagination || { page, limit: PAGE_SIZE, total: 0, pages: 1 });
        } catch (err) {
            console.error("Activity history error:", err);
            setError(err.response?.data?.message || "Failed to load activity history");
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            loadHistory(pagination.page - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination.page < pagination.pages) {
            loadHistory(pagination.page + 1);
        }
    };

    const hasNextPage = pagination.page < pagination.pages;
    const pageTotal = Math.max(pagination.pages || 1, pagination.page);
    const visibleTotal = pagination.total > 0 ? `${pagination.total} total` : `${activities.length} shown`;
    const missingSolvedCount = Math.max(
        (pagination.leetcodeSolvedTotal || 0) - (pagination.syncedQuestionTotal || pagination.total || 0),
        0,
    );

    if (loading && activities.length === 0) {
        return (
            <section className="space-y-6">
                <PageHeader
                    eyebrow="Questions"
                    title="Solved Questions"
                    description="View your synced LeetCode solved questions"
                />
                <div className="text-center text-text-muted">Loading history...</div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <PageHeader
                eyebrow="Questions"
                title="Solved Questions"
                description="Solved questions tracked from your LeetCode syncs will appear here with pagination and direct links"
            />

            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {missingSolvedCount > 0 && (
                <div className="rounded-xl border border-yellow/30 bg-yellow/10 px-4 py-3 text-sm text-yellow">
                    Showing {pagination.syncedQuestionTotal || pagination.total} synced question titles from your {pagination.leetcodeSolvedTotal} solved problems. LeetCode only exposes recent accepted submissions publicly, so older question titles are not available to this app yet.
                </div>
            )}

            {activities.length === 0 ? (
                <div className="rounded-2xl border border-border bg-dark-gray p-8 text-center">
                    <p className="text-text-muted">No solved questions tracked yet. Future LeetCode syncs will add questions here automatically.</p>
                </div>
            ) : (
                <>
                    <div className="rounded-2xl border border-border bg-dark-gray overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-dark">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-muted">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-muted">Question</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-muted">Difficulty</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-muted">Solved At</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-text-muted">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity, index) => (
                                        <tr key={activity._id || index} className="border-b border-border hover:bg-dark/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-text-secondary">
                                                {(pagination.page - 1) * pagination.limit + index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-main font-medium">{activity.title}</td>
                                            <td className={`px-6 py-4 text-sm font-semibold ${difficultyColors[activity.difficulty] || "text-text-muted"}`}>
                                                {activity.difficulty}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-secondary">
                                                <div>
                                                    <div>{new Date(activity.solvedAt).toLocaleDateString()}</div>
                                                    <div className="text-xs text-text-muted">{formatTimeAgo(activity.solvedAt)}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {activity.questionUrl ? (
                                                    <a
                                                        href={activity.questionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-orange hover:text-orange/80 transition-colors"
                                                        title="Open on LeetCode"
                                                    >
                                                        <FiExternalLink size={16} />
                                                    </a>
                                                ) : (
                                                    <span className="text-text-muted">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-dark-gray p-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={handlePrevPage}
                            disabled={pagination.page === 1 || loading}
                            className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-main transition-all hover:enabled:border-orange hover:enabled:text-orange disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiChevronLeft size={16} /> Previous
                        </button>

                        <span className="text-center text-sm text-text-muted">
                            Page {pagination.page} of {pageTotal} ({visibleTotal})
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={!hasNextPage || loading}
                            className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-main transition-all hover:enabled:border-orange hover:enabled:text-orange disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <FiChevronRight size={16} />
                        </button>
                    </div>
                </>
            )}
        </section>
    );
};

export default History;
