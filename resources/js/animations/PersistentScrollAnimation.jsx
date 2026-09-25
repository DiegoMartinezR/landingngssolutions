// components/PersistentScrollAnimation.js
import { motion } from "framer-motion";
import { scrollEffects } from "./animationVariantsSccroll";

export const PersistentScrollAnimation = ({
    children,
    variant = "persistentSlide",
    className = "",
    viewportOptions = {},
}) => {
    const selectedVariant =
        scrollEffects[variant] || scrollEffects.persistentSlide;

    return (
        <motion.div
            initial="offscreen"
            animate="visible"
            variants={selectedVariant}
            whileInView={["onscreen", "persistent"]}
            onViewportEnter={() => {}}
            onViewportLeave={() => {}}
            viewport={{
                once: false,
                amount: 0.2,
                ...viewportOptions,
            }}
            className={className}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
};
