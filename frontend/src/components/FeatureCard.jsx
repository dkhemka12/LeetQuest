import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon, delay = 0 }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
            className="rounded-xl border border-border bg-dark p-6 transition-colors hover:border-orange/50"
        >
            <div className="mb-4 text-4xl">{icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-text-main">{title}</h3>
            <p className="text-text-muted">{description}</p>
        </motion.article>
    );
};

export default FeatureCard;