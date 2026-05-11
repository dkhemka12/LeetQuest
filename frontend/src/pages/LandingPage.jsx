import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 border-b border-border bg-dark-gray">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-orange flex items-center justify-center text-dark font-bold text-xl">L</div>
          <span className="text-xl font-semibold tracking-wide">Leet<span className="text-orange">Quest</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-orange transition-colors">Sign In</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-light-gray hover:bg-border rounded-md transition-colors">Create Account</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl w-full flex flex-col items-center text-center z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Level Up Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-yellow">
                Coding Journey
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-text-muted max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A motivational and productivity layer over LeetCode. Track your streaks, earn XP, unlock badges, and challenge your friends.
          </motion.p>
          
          <motion.div 
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/register" className="px-8 py-3 bg-orange hover:bg-orange-hover text-dark font-semibold rounded-md transition-colors flex items-center gap-2">
              Start Your Quest
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <a href="#features" className="px-8 py-3 bg-light-gray hover:bg-border text-text-main font-medium rounded-md transition-colors">
              Explore Features
            </a>
          </motion.div>

          <motion.div 
            className="mt-20 w-full max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative rounded-xl border border-border bg-dark-gray p-4 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                <div className="w-3 h-3 rounded-full bg-red"></div>
                <div className="w-3 h-3 rounded-full bg-yellow"></div>
                <div className="w-3 h-3 rounded-full bg-green"></div>
              </div>
              <div className="flex flex-col gap-3 text-left">
                <div className="h-4 w-3/4 bg-light-gray rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-light-gray rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-light-gray rounded animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Preview Section */}
      <section id="features" className="py-20 px-8 bg-dark-gray border-t border-border relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Track Streaks"
              description="Stay consistent. Monitor your daily progress and never break the chain."
              icon="🔥"
              delay={0.1}
            />
            <FeatureCard 
              title="Earn XP & Level Up"
              description="Gain experience points for every problem solved. Watch your level grow."
              icon="⭐"
              delay={0.2}
            />
            <FeatureCard 
              title="Challenge Friends"
              description="Compete in private leaderboards and set custom challenges to stay motivated."
              icon="⚔️"
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, description, icon, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="p-6 bg-dark border border-border rounded-xl flex flex-col items-start hover:border-orange/50 transition-colors"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-muted">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
