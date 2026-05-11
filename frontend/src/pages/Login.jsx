import React from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";

const Login = ({ mode = "login" }) => {
    const isRegister = mode === "register";

    return (
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center px-4 py-12">
            <div className="w-full rounded-3xl border border-border bg-dark-gray p-8 shadow-2xl">
                <PageHeader
                    eyebrow={isRegister ? "Create account" : "Welcome back"}
                    title={isRegister ? "Join LeetQuest" : "Log in to LeetQuest"}
                    description={
                        isRegister
                            ? "Start tracking streaks, XP, and progress."
                            : "Continue your gamified LeetCode journey."
                    }
                />

                <form className="mt-8 space-y-4">
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-xl border border-border bg-dark px-4 py-3 text-text-main outline-none"
                    />
                    <button
                        type="button"
                        className="w-full rounded-xl bg-orange px-4 py-3 font-semibold text-dark hover:bg-orange-hover"
                    >
                        {isRegister ? "Create account" : "Log in"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-text-muted">
                    {isRegister ? "Already have an account?" : "Need an account?"}{" "}
                    <Link to={isRegister ? "/login" : "/register"} className="text-orange hover:underline">
                        {isRegister ? "Log in" : "Register"}
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
