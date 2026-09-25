import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "./hooks/useTranslation";

const DynamicGalleryService = ({ service }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [expanded, setExpanded] = useState(false);

    // Configuración de animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    // Efecto hover mejorado para la imagen
    const imageHover = {
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    // Determina el layout basado en el número de imágenes
    const getLayoutConfig = (count) => {
        if (count === 1) {
            return {
                gridClass: "grid-cols-1 h-[500px] gap-4",
                imageClasses: ["h-full"],
            };
        }

        if (count === 2) {
            return {
                gridClass: "grid-cols-2 h-[600px] gap-4",
                imageClasses: ["h-full", "h-full"],
            };
        }

        if (count === 3) {
            return {
                gridClass: "grid-cols-2 grid-rows-2 gap-4",
                imageClasses: ["row-span-2 h-full", "h-[250px]", "h-[250px]"],
            };
        }

        if (count === 4) {
            return {
                gridClass: "grid-cols-2 grid-rows-2 gap-4 h-[600px]",
                imageClasses: Array(4).fill("h-full"),
            };
        }

        // Estructura base para 5 imágenes
        return {
            gridClass: "grid-cols-3 grid-rows-2 gap-4 h-[600px]",
            imageClasses: [
                "row-span-2 h-full",
                "h-full",
                "h-full",
                "h-full",
                "h-full",
            ],
        };
    };

    if (!service?.gallery?.length) return null;

    const totalImages = service.gallery.length;
    const imagesToShow = expanded ? totalImages : Math.min(totalImages, 5);
    const groups = [];

    // Dividir en grupos de 5 imágenes
    for (let i = 0; i < imagesToShow; i += 5) {
        const groupSize = Math.min(5, imagesToShow - i);
        groups.push({
            images: service.gallery.slice(i, i + groupSize),
            config: getLayoutConfig(groupSize),
        });
    }
    const { t } = useTranslation();

    return (
        <div className="w-full mx-auto my-8">
            {/* Galería principal con animaciones */}
            {groups.map((group, groupIndex) => (
                <motion.div
                    key={groupIndex}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className={`grid ${group.config.gridClass} rounded-3xl overflow-hidden mb-8`}
                >
                    {group.images.map((image, index) => (
                        <motion.div
                            key={`${groupIndex}-${index}`}
                            className={`relative ${
                                group.config.imageClasses[index] || "h-full"
                            } overflow-hidden cursor-pointer rounded-3xl`}
                            onClick={() => setSelectedImage(image)}
                            whileHover="hover"
                        >
                            <motion.div
                                className="w-full h-full"
                                variants={imageHover}
                                style={{ originX: 0.5, originY: 0.5 }} // Para que el zoom sea desde el centro
                            >
                                <img
                                    src={`/api/service/media/${image}`}
                                    alt={`${service.title} - Imagen ${
                                        groupIndex * 5 + index + 1
                                    }`}
                                    className="w-full h-full object-cover absolute inset-0 rounded-3xl"
                                    onError={(e) => {
                                        e.target.src =
                                            "/assets/img/placeholder.jpg";
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            ))}

            {/* Botón para mostrar más */}
            {totalImages > 5 && (
                <div className="flex justify-center mt-4">
                    <motion.button
                        onClick={() => setExpanded(!expanded)}
                        className="px-6 py-3 bg-gray-100 rounded-full flex items-center gap-2"
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: "#f3f4f6",
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {expanded ? (
                            <>
                                <span>
                                    {t("public.btn.see_less", "Mostrar menos")}
                                </span>
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </motion.svg>
                            </>
                        ) : (
                            <>
                                <span>
                                    {t("public.btn.see_all", "Ver más")}
                                </span>
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </motion.svg>
                            </>
                        )}
                    </motion.button>
                </div>
            )}

            {/* Modal para imagen ampliada */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                src={`/api/service/media/${selectedImage}`}
                                alt="Imagen ampliada"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            />
                            <motion.button
                                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 90,
                                    backgroundColor: "#f3f4f6",
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedImage(null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DynamicGalleryService;
