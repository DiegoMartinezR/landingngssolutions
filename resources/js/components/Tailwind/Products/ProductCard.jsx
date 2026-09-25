import React from "react";

const ProductCard = ({ product, visible = true }) => {
    const formatPrice = (price) =>
        new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
        }).format(price);
    console.log(product);
    return (
        <a href={`/product/${product.slug}`}>
            <div className="w-full flex items-center justify-center sm:w-max">
                <div className="group w-max  cursor-pointer transition-all duration-300">
                    <div className="bg-white rounded-xl">
                        {/* Imagen del producto y etiqueta de descuento */}
                        <div className="relative overflow-hidden">
                            <div className="relative group aspect-square overflow-hidden flex items-center rounded-xl justify-center">
                                {product.discount && (
                                    <div className="absolute top-2 right-2 bg-[#212529] z-50 text-white text-base font-medium px-3 pt-[1px] pb-1 rounded-2xl">
                                        <span className="text-[12.09px] leading-[14.72px]">
                                            Ahorras
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <img
                                                src="https://i.ibb.co/S7R3V0tf/image.png"
                                                className="w-3 mb-1"
                                                alt="Descuento"
                                            />
                                            <p className="text-[16.08px] leading-[20.9px] font-bold">
                                                S/{" "}
                                                {parseFloat(
                                                    product.price -
                                                        product.discount
                                                ).toFixed(0)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {product.colors ? (
                                    <img
                                        src={`/api/items/media/${product.colors[0].image}`}
                                        alt={product.name}
                                        className="w-[300.38px] md:w-[300.38px] md:h-[300.38px] 2xl:w-[346.38px] 2xl:h-[346.38px] object-cover group-hover:brightness-100 transition-all duration-300"
                                        loading="lazy"
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                ) : (
                                    <img
                                        src={`/api/items/media/${product.image}`}
                                        alt={product.name}
                                        className="w-[300.38px] md:w-[300.38px] md:h-[300.38px] 2xl:w-[346.38px] 2xl:h-[346.38px] object-cover group-hover:brightness-100 transition-all duration-300"
                                        loading="lazy"
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                )}

                                <div className="hidden lg:block absolute bottom-0 rounded-xl left-0 w-full h-full bg-[#00000080] group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                        </div>

                        {/* Información del producto */}
                        <div
                            className={`px-4 pb-4 pt-2 lg:pt-8 block  lg:block ${
                                visible ? "block" : "hidden"
                            }`}
                        >
                            <div className="flex justify-between">
                                <h3 className="text-[22.44px] md:text-[25.44px] 2xl:text-[29.44px] md:leading-[20.64px] 2xl:leading-[41.64px] text-[#212529] font-semibold line-clamp-2">
                                    {product.name}
                                </h3>
                                <span className="text-[22.56px] md:text-[27.56px] 2xl:text-[32.56px] md:leading-[20.64px] 2xl:leading-[39.79px] font-bold text-[#FC58BE]">
                                    {formatPrice(product.final_price)}
                                </span>
                            </div>

                            {/* Precio */}
                            <div className="flex justify-between items-baseline gap-2">
                                <h4 className="text-[12.28px] md:text-[14.28px] 2xl:text-[16.28px] text-[#212529] line-clamp-2 lg:leading-[29.18px]">
                                    ({product.summary})
                                </h4>
                                {product.discount && (
                                    <span className="text-[12.28px] lg:text-[14.28px] 2xl:text-[16.8px] text-[#9F9F9F] line-through">
                                        S/ {Number(product.price).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default ProductCard;
