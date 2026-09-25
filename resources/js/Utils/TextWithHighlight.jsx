const TextWithHighlight = ({
    text,
    split = false,
    split_coma = false,
    split_dos_puntos = false,
    className = "",
    color = "",
}) => {
    if (typeof text !== "string" || !text) return <></>;

    // Función para procesar el texto con resaltados
    const renderHighlightedText = (textToRender) => {
        if (typeof textToRender !== "string" || !textToRender) return "";
        const parts = textToRender.split(/(\*[^*]+\*)/g); // separa todo lo entre *...*

        return parts.map((part, index) =>
            part.startsWith("*") && part.endsWith("*") ? (
                <span
                    key={index}
                    className={`font-bold ${className} ${color || "text-[#96263e]"}`}
                >
                    {part.slice(1, -1)}
                </span>
            ) : (
                <span key={index} className={className}>
                    {part}
                </span>
            ),
        );
    };

    if (split) {
        const words = text.split("*");
        const firstWord = words[0];
        const remainingText = words.slice(1).join("");

        return (
            <div className="flex flex-col">
                <span className={`block ${className}`}>
                    {renderHighlightedText(firstWord)}
                </span>
                <span className={`block ${className} ${color}`}>
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    if (split_coma) {
        const words = text.split(",");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(",");

        return (
            <div className="flex flex-col">
                <span className={`block ${className}`}>
                    {renderHighlightedText(firstWord)}
                </span>
                <span className={`block ${className}`}>
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    if (split_dos_puntos) {
        const words = text.split(":");
        const firstWord = words[0];
        const remainingText = words.slice(1).join(":");

        return (
            <div className="flex flex-col">
                <span className={`block ${className}`}>
                    {renderHighlightedText(firstWord)}
                </span>
                <span className={`block ${className}`}>
                    {renderHighlightedText(remainingText)}
                </span>
            </div>
        );
    }

    return <>{renderHighlightedText(text)}</>;
};

export default TextWithHighlight;
