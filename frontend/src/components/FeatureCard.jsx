import React, { useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon, delay = 0 }) => {
    const cardRef = useRef(null);

    const handleMouseEnter = (e) => {
        gsap.to(e.currentTarget, {
            y: -12,
            boxShadow: '0 20px 50px rgba(255, 161, 22, 0.25)',
            duration: 0.3,
            ease: 'power2.out',
        });

        // Animate icon
        if (cardRef.current) {
            gsap.to(cardRef.current.querySelector('[class*="mb-4"]'), {
                scale: 1.15,
                duration: 0.3,
                ease: 'back.out',
            });
        }
    };

    const handleMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            boxShadow: '0 0px 0px rgba(255, 161, 22, 0)',
            duration: 0.3,
            ease: 'power2.out',
        });

        // Reset icon
        if (cardRef.current) {
            gsap.to(cardRef.current.querySelector('[class*="mb-4"]'), {
                scale: 1,
                duration: 0.3,
                ease: 'back.out',
            });
        }
    };

    return (
        <motion.article
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="rounded-xl border border-border bg-dark p-6 transition-all cursor-pointer hover:border-orange/50"
        >
            <div className="mb-4 text-4xl">{icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-text-main">{title}</h3>
            <p className="text-text-muted">{description}</p>
        </motion.article>
    );
};

export default FeatureCard;