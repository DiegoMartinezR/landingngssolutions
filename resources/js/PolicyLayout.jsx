import React from "react";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import HtmlContent from "./Utils/HtmlContent";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PolicyLayout = ({ title, content, generals, services, socials }) => {
    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-brand-dark">
            <Header generals={generals} forceFixed={true} />

            <div className="relative pt-48 pb-12 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-light text-brand-dark mb-4 tracking-tight uppercase">
                        {title}
                    </h1>
                    <div className="h-1 w-24 bg-brand-main mx-auto rounded-full"></div>
                </motion.div>
            </div>

            {/* Content Area */}
            <main className="relative py-24 px-4 -mt-16 z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white p-10 md:p-20 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-gray-100/50 backdrop-blur-sm"
                    >
                        <div
                            className="prose text-gray-600 prose-lg prose-slate max-w-none 
                           
                        "
                        >
                            <HtmlContent html={content} />
                        </div>

                        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 text-brand-main font-semibold hover:text-brand-dark hover:gap-3 transition-all group"
                            >
                                Volver al inicio
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer generals={generals} services={services} socials={socials} />
        </div>
    );
};

export default PolicyLayout;
