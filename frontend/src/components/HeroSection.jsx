import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-6 lg:px-8">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-orange/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-green/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <p className="text-sm uppercase tracking-[0.35em] text-text-muted">
                        Gamify your LeetCode journey
                    </p>
                    <h1 className="mt-4 text-5xl font-bold tracking-tight text-text-main md:text-7xl">
                        Level up your <br />
                        <span className="bg-linear-to-r from-orange to-yellow bg-clip-text text-transparent">
                            coding consistency
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    className="mt-6 max-w-2xl text-lg text-text-muted md:text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Track streaks, earn XP, unlock badges, and challenge friends while always solving on the real LeetCode platform.
                </motion.p>

                <motion.div
                    className="mt-10 flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                >
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 rounded-md bg-orange px-8 py-3 font-semibold text-dark transition-colors hover:bg-orange-hover"
                    >
                        Start your quest
                    </Link>
                    <a
                        href="#features"
                        className="rounded-md bg-light-gray px-8 py-3 font-medium text-text-main transition-colors hover:bg-border"
                    >
                        Explore features
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;