import { useRef, useEffect, useState } from "react";
import { useSprings, animated } from "@react-spring/web";

const BlurText = ({
    text,
    split = false,
    split_coma = false,
    delay = 100,
    animateBy = "words", // 'words' or 'letters'
    direction = "top", // 'top' or 'bottom'
    threshold = 0.1,
    rootMargin = "0px",
    easing = "easeOutCubic",
}) => {
    const ref = useRef();
    const [inView, setInView] = useState(false);
    const [loop, setLoop] = useState(true);

    // Función para procesar el texto con resaltados
    const processText = (textToProcess) => {
        return textToProcess.split(/(\*[^*]+\*)/g); // Separa todo lo entre *...*
    };

    const parts = processText(text);

    const defaultFrom =
        direction === "top"
            ? {
                  filter: "blur(10px)",
                  opacity: 0,
                  transform: "translate3d(0,-50px,0)",
              }
            : {
                  filter: "blur(10px)",
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
              };

    const defaultTo = [
        {
            filter: "blur(5px)",
            opacity: 0.5,
            transform:
                direction === "top"
                    ? "translate3d(0,5px,0)"
                    : "translate3d(0,-5px,0)",
        },
        { filter: "blur(0px)", opacity: 1, transform: "translate3d(0,0,0)" },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(ref.current);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    // Animación en loop
    useEffect(() => {
        if (inView && loop) {
            const interval = setInterval(() => {
                setInView(false); // Reiniciar la animación
                setTimeout(() => setInView(true), 100); // Reanudar después de un breve retraso
            }, 5000); // Intervalo de 5 segundos para reiniciar la animación

            return () => clearInterval(interval);
        }
    }, [inView, loop]);

    const springs = useSprings(
        parts.length,
        parts.map((part, index) => ({
            from: defaultFrom,
            to: inView
                ? async (next) => {
                      for (const step of defaultTo) {
                          await next(step);
                      }
                  }
                : defaultFrom,
            delay: index * delay,
            config: { easing },
        }))
    );

    const renderHighlightedText = () => {
        return springs.map((props, index) => {
            const part = parts[index];
            const isHighlighted = part.startsWith("*") && part.endsWith("*");

            return (
                <animated.span
                    key={index}
                    style={{
                        ...props,
                        display: "inline-block",
                        willChange: "transform, filter, opacity",
                        color: isHighlighted ? "#224483" : "inherit",
                        fontWeight: isHighlighted ? "bold" : "normal",
                    }}
                >
                    {isHighlighted ? part.slice(1, -1) : part}
                    {animateBy === "words" &&
                        index < parts.length - 1 &&
                        "\u00A0"}
                </animated.span>
            );
        });
    };

    if (split) {
        const words = text.split(" ");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(" ");

        return (
            <div ref={ref} className="flex flex-col">
                <span className="block">{firstWord}</span>
                <span className="block">{renderHighlightedText()}</span>
            </div>
        );
    }

    if (split_coma) {
        const words = text.split(",");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(",");

        return (
            <div ref={ref} className="flex flex-col">
                <span className="block">{firstWord}</span>
                <span className="block">{renderHighlightedText()}</span>
            </div>
        );
    }

    return <span ref={ref}>{renderHighlightedText()}</span>;
};

export default BlurText;
