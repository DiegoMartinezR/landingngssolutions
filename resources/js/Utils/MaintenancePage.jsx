import { motion } from "framer-motion";
import { useState } from "react";

const MaintenancePage = () => {
    const [isHovered, setIsHovered] = useState(false);

    // Animaciones
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
            },
        },
    };

    const gear = {
        rotate: 0,
        transition: {
            repeat: Infinity,
            ease: "linear",
            duration: 8,
        },
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-white font-sans"
        >
            <motion.div variants={item} className="relative w-32 h-32 mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 12,
                    }}
                    className="absolute inset-0 text-gray-300 text-6xl flex items-center justify-center"
                >
                    ⚙️
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 8,
                    }}
                    className="absolute inset-0 text-gray-400 text-4xl flex items-center justify-center"
                    style={{ top: "30%", left: "30%" }}
                >
                    ⚙️
                </motion.div>
            </motion.div>

            <motion.h1
                variants={item}
                className="text-4xl font-light text-gray-800 mb-4 text-center"
            >
                Estamos mejorando tu experiencia
            </motion.h1>

            <motion.div
                variants={item}
                className="w-24 h-1 bg-[#224483] my-6"
            />

            <motion.p
                variants={item}
                className="text-gray-600 max-w-md text-center mb-8 leading-relaxed"
            >
                Nuestro sitio está en mantenimiento para ofrecerte un servicio
                mejorado. Vuelve pronto para descubrir las novedades.
            </motion.p>

            {/*  <motion.div
                variants={item}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="mt-8"
            >
                <motion.a
                    href="mailto:soporte@empresa.com"
                    className="px-6 py-3 border border-blue-400 text-blue-500 rounded-lg inline-flex items-center"
                    animate={{
                        backgroundColor: isHovered
                            ? "rgba(59, 130, 246, 0.05)"
                            : "rgba(255, 255, 255, 0)",
                        borderColor: isHovered ? "#3B82F6" : "#60A5FA",
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.span
                        animate={{
                            x: isHovered ? 2 : 0,
                        }}
                        transition={{
                            repeat: isHovered ? Infinity : 0,
                            repeatType: "reverse",
                            duration: 0.8,
                        }}
                    >
                        📩
                    </motion.span>
                    <span className="ml-2">Contactar al equipo</span>
                </motion.a>
            </motion.div>*/}

            {/* <motion.div variants={item} className="mt-12 text-sm text-gray-400">
                <p>© {new Date().getFullYear()} Tu Empresa</p>
            </motion.div>*/}
        </motion.div>
    );
};

export default MaintenancePage;
