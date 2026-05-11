import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-border bg-dark-gray/80">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-text-muted sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
                <p>
                    LeetQuest keeps your LeetCode progress visible, measurable, and motivating.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <Link to="/dashboard" className="hover:text-orange transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/analytics" className="hover:text-orange transition-colors">
                        Analytics
                    </Link>
                    <Link to="/challenges" className="hover:text-orange transition-colors">
                        Challenges
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
