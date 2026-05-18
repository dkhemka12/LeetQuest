import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiMessageCircle, FiSend } from "react-icons/fi";

const Footer = () => {
    const githubUrl = import.meta.env.VITE_GITHUB_URL || "https://github.com";
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "contact@leetquest.com";

    return (
        <footer className="border-t border-border bg-dark/95">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-orange">LeetQuest</p>
                            <h2 className="mt-2 text-2xl font-bold text-text-main">
                                Made by Devansh Khemka
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-6 text-text-muted">
                            LeetQuest keeps your LeetCode progress visible, measurable, and motivating.
                            Build streaks, compete with friends, and stay consistent.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Contact Us</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <Link
                                to="/send-message"
                                className="flex items-center gap-3 rounded-2xl border border-border bg-dark px-4 py-3 text-sm text-text-main transition-colors hover:border-orange hover:text-orange"
                            >
                                <FiSend size={16} />
                                Send Message
                            </Link>
                            <Link
                                to="/feedback"
                                className="flex items-center gap-3 rounded-2xl border border-border bg-dark px-4 py-3 text-sm text-text-main transition-colors hover:border-orange hover:text-orange"
                            >
                                <FiMessageCircle size={16} />
                                Feedback
                            </Link>
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-2xl border border-border bg-dark px-4 py-3 text-sm text-text-main transition-colors hover:border-orange hover:text-orange"
                            >
                                <FiGithub size={16} />
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} LeetQuest. All rights reserved.</p>
                    <p>Keep building consistency, one solved problem at a time.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
