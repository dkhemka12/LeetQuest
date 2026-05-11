import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiOutlineChartBar,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineLink,
  HiOutlineTrophy,
  HiOutlineUsers,
  HiOutlineBolt,
} from "react-icons/hi2";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";

const quickStats = [
  { label: "Daily streaks", value: "1+", detail: "Track whether you solved at least one problem today." },
  { label: "XP values", value: "10 / 25 / 50", detail: "Easy, medium, and hard problems each have a clear reward." },
  { label: "Core surfaces", value: "Dashboard + Analytics", detail: "See what matters without jumping through extra screens." },
];

const featureItems = [
  {
    title: "Streak tracking",
    description: "Keep a visible chain of your daily solving habits.",
    icon: <HiOutlineBolt className="text-3xl text-orange" />,
  },
  {
    title: "XP and leveling",
    description: "Turn solved problems into progress that feels tangible.",
    icon: <HiOutlineTrophy className="text-3xl text-yellow" />,
  },
  {
    title: "Weak-topic insight",
    description: "Spot areas like DP, Graphs, and Trees before interviews.",
    icon: <HiOutlineChartBar className="text-3xl text-green" />,
  },
  {
    title: "Friends and leaderboards",
    description: "Compare progress with friends and stay accountable.",
    icon: <HiOutlineUsers className="text-3xl text-text-main" />,
  },
  {
    title: "Challenges",
    description: "Set topic-based targets with deadlines and winners.",
    icon: <HiOutlineChatBubbleBottomCenterText className="text-3xl text-text-main" />,
  },
  {
    title: "LeetCode sync",
    description: "Use public LeetCode data, never an in-app coding judge.",
    icon: <HiOutlineLink className="text-3xl text-text-main" />,
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Connect your username",
    description: "Add your public LeetCode username so the app can sync progress.",
  },
  {
    step: "02",
    title: "Track the important signals",
    description: "Watch your XP, streak, solved stats, and recent activity update.",
  },
  {
    step: "03",
    title: "Use the data to stay consistent",
    description: "Lean on comparisons, badges, and analytics to keep solving.",
  },
];

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-dark text-text-main">
      <Navbar />

      <main className="flex-1 overflow-hidden">
        <section className="relative overflow-hidden px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pt-20">
          <div className="absolute left-1/4 top-16 h-96 w-96 rounded-full bg-orange/10 blur-[120px] pointer-events-none" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-green/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-5"
              >
                <span className="inline-flex rounded-full border border-border bg-dark-gray px-4 py-2 text-xs uppercase tracking-[0.3em] text-text-muted">
                  Gamified LeetCode companion
                </span>
                <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-text-main md:text-7xl">
                  Turn LeetCode progress into a
                  <span className="bg-linear-to-r from-orange to-yellow bg-clip-text text-transparent">
                    motivating streak engine
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="max-w-2xl text-lg leading-8 text-text-muted md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                LeetQuest turns your public LeetCode activity into XP, streaks, badges,
                analytics, and friendly competition. It is not a coding editor or judge.
                It is the layer that keeps you consistent.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md bg-orange px-8 py-3 font-semibold text-dark transition-colors hover:bg-orange-hover"
                >
                  Start your quest
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-md bg-light-gray px-8 py-3 font-medium text-text-main transition-colors hover:bg-border"
                >
                  Explore features
                </a>
              </motion.div>

              <motion.div
                className="grid gap-4 sm:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border bg-dark-gray p-4 shadow-lg"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-bold text-text-main">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-text-muted">{stat.detail}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-4xl border border-border bg-dark-gray/90 p-5 shadow-2xl">
                <div className="absolute inset-0 rounded-4xl bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                <div className="relative space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                        Live preview
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-text-main">
                        Your progress at a glance
                      </h2>
                    </div>
                    <div className="rounded-full border border-green/30 bg-green/10 px-3 py-1 text-sm text-green">
                      Synced today
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-dark p-4">
                      <p className="text-sm text-text-muted">Streak</p>
                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-5xl font-bold text-yellow">12</p>
                        <span className="rounded-full border border-border bg-light-gray px-3 py-2 text-sm font-semibold tracking-[0.2em] text-text-main">
                          ST
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-text-muted">One solved problem keeps the chain alive.</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-dark p-4">
                      <p className="text-sm text-text-muted">XP</p>
                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-5xl font-bold text-orange">840</p>
                        <span className="rounded-full border border-border bg-light-gray px-3 py-2 text-sm font-semibold tracking-[0.2em] text-text-main">
                          XP
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-text-muted">Medium and hard problems push your level up faster.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-dark p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-text-muted">Weak topics</p>
                      <span className="text-xs uppercase tracking-[0.3em] text-text-muted">Focus list</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        ["Dynamic Programming", "High priority"],
                        ["Graphs", "Needs practice"],
                        ["Binary Trees", "Steady"],
                      ].map(([label, note]) => (
                        <div key={label} className="flex items-center justify-between rounded-xl bg-light-gray px-4 py-3">
                          <span className="font-medium text-text-main">{label}</span>
                          <span className="text-sm text-text-muted">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="border-t border-border bg-dark-gray px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Why it helps</p>
              <h2 className="text-3xl font-bold text-text-main md:text-4xl">
                Everything you need to stay consistent.
              </h2>
              <p className="text-text-muted">
                The app is intentionally narrow: it tracks progress, shows useful trends,
                and makes practice feel rewarding without pretending to be a coding judge.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featureItems.map((feature, index) => (
                <FeatureCard key={feature.title} delay={index * 0.08} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-4xl border border-border bg-dark-gray p-8 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
                  How it works
                </p>
                <h2 className="text-3xl font-bold text-text-main md:text-4xl">
                  A simple flow with no extra friction.
                </h2>
                <p className="text-text-muted">
                  Connect once, sync public data, and use the dashboards to keep yourself on track.
                </p>
              </div>

              <div className="grid gap-4">
                {workflowSteps.map((step) => (
                  <div key={step.step} className="rounded-2xl border border-border bg-dark p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-bold text-dark">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-main">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-text-muted">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-4xl border border-orange/20 bg-linear-to-r from-dark-gray to-dark p-8 text-center md:p-12">
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
              Ready to start
            </p>
            <h2 className="mt-4 text-3xl font-bold text-text-main md:text-5xl">
              Build momentum before your next interview.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-muted">
              Create your account, connect your LeetCode username, and let the platform turn daily practice into visible progress.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="rounded-md bg-orange px-8 py-3 font-semibold text-dark transition-colors hover:bg-orange-hover"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-border px-8 py-3 font-medium text-text-main transition-colors hover:bg-light-gray"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
