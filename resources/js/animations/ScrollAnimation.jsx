// components/ScrollAnimation.js
import { motion } from "framer-motion";

const scrollVariants = {
    offscreen: {
        opacity: 0,
        y: 30, // Reduce la distancia inicial para que sea más suave
        scale: 0.98, // Agrega un ligero escalado para profundidad
    },
    onscreen: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            bounce: 0.25, // Reduce el rebote para suavidad
            duration: 0.8,
            damping: 10, // Añade amortiguación
            stiffness: 100, // Rigidez media para fluidez
        },
    },
};

export const ScrollAnimation = ({
    children,
    className = "",
    repeat = true,
}) => {
    return (
        <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: !repeat, amount: 0.3 }} // 30% del elemento debe ser visible
            variants={scrollVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
};
