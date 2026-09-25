import { motion } from 'framer-motion';

export default function HealthSection({ landingBenefits, benefits }) {
    // Animaciones
    const cardHover = {
        hover: {
            y: -10,
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 10
            }
        }
    };

    const iconHover = {
        hover: {
            rotate: 10,
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 500
            }
        }
    };

    const imageHover = {
        hover: {
            scale: 1.03,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    return (
        <>
            {benefits && benefits.length > 0 && (
                <div className="min-h-screen lg:min-h-max mt-8 font-poppins lg:px-[5%] lg:max-w-[82rem] lg:mx-auto">
                    <div className="max-w-md mx-auto px-4 py-4 lg:max-w-full lg:flex lg:flex-row lg:py-0 lg:px-0 lg:mt-16 lg:justify-between lg:items-center lg:gap-4">
                        <div className="lg:w-4/12">
                            {benefits.slice(0, 2).map((benefit, index) => (
                                <motion.div 
                                    key={index}
                                    className="bg-[#F8F8F8] rounded-3xl px-[22px] py-[18px] mb-7 lg:w-11/12 lg:p-5 cursor-pointer"
                                    whileHover="hover"
                                    variants={cardHover}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <motion.h2 
                                            className="text-3xl font-bold mb-2 leading-[120%] w-[calc(100%-4rem)]"
                                            whileHover={{ color: "#224483" }}
                                        >
                                            {benefit?.name &&
                                            benefit?.name === "Alivio del dolor" ? (
                                                <>
                                                    Alivio
                                                    <br />
                                                    del dolor
                                                </>
                                            ) : (
                                                benefit?.name
                                            )}
                                        </motion.h2>
                                        <motion.div 
                                            className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center"
                                            variants={iconHover}
                                        >
                                            <motion.img
                                                src={`/api/strength/media/${benefit?.image}`}
                                                className="w-8 h-8 object-cover"
                                                whileHover={{ rotate: 5 }}
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.p 
                                        className="text-[#242424] text-lg mt-14"
                                        whileHover={{ x: 3 }}
                                    >
                                        {benefit?.description}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Imagen */}
                        <motion.div 
                            className="flex my-4 h-full rounded-2xl overflow-hidden lg:w-4/12"
                            whileHover="hover"
                            variants={imageHover}
                        >
                            <img
                                src={`/api/landing_home/media/${landingBenefits.image}`}
                                alt="Equipo médico profesional"
                                className="w-full h-full lg:h-[450px] object-cover"
                            />
                        </motion.div>

                        <div className="lg:w-4/12 lg:flex lg:justify-end lg:flex-col lg:items-end">
                            {benefits.slice(2, 4).map((benefit, index) => (
                                <motion.div 
                                    key={index + 2}
                                    className="bg-[#F8F8F8] rounded-3xl px-[22px] py-[18px] mb-7 lg:w-11/12 lg:p-5 cursor-pointer"
                                    whileHover="hover"
                                    variants={cardHover}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <motion.h2 
                                            className="text-3xl font-bold mb-2 leading-[120%] w-[calc(100%-4rem)]"
                                            whileHover={{ color: "#224483" }}
                                        >
                                            {benefit?.name &&
                                            benefit?.name === "Alivio del dolor"
                                                ? benefit?.name.replace(
                                                    /^(\S+)\s(.*)/,
                                                    "$1<br>$2"
                                                )
                                                : benefit?.name}
                                        </motion.h2>
                                        <motion.div 
                                            className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center"
                                            variants={iconHover}
                                        >
                                            <motion.img
                                                src={`/api/strength/media/${benefit?.image}`}
                                                className="w-8 h-8 object-cover"
                                                whileHover={{ rotate: 5 }}
                                            />
                                        </motion.div>
                                    </div>
                                    <motion.p 
                                        className="text-[#242424] text-lg mt-14"
                                        whileHover={{ x: 3 }}
                                    >
                                        {benefit?.description}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}