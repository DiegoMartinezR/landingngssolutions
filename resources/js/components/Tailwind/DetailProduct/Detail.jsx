import React, { useContext, useEffect, useState } from "react";
import { CarritoContext } from "../../../context/CarritoContext";
const CountdownTimer = ({ startDate, endDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Si la promoción aún no inicia
            if (now < start) {
                return {
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                };
            }

            // Si la promoción ya terminó
            if (now > end) {
                return {
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                };
            }

            // Calcular diferencia
            const difference = end - now;
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            return {
                hours: hours.toString().padStart(2, "0"),
                minutes: minutes.toString().padStart(2, "0"),
                seconds: seconds.toString().padStart(2, "0"),
            };
        };

        // Actualizar inmediatamente
        setTimeLeft(calculateTimeLeft());

        // Configurar intervalo para actualizar cada segundo
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Limpiar intervalo al desmontar
        return () => clearInterval(timer);
    }, [startDate, endDate]);

    return (
        <div className="absolute top-8 mx-auto font-bold flex items-center justify-center bg-[#FF9900] text-white md:text-[17px] 2xl:text-[35.85px] px-10 py-1 w-max rounded-full">
            Solo por {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
        </div>
    );
};

const Detail = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalTalla, setIsModalTalla] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(
        item.colors.length > 0 ? item.colors[0].name : ""
    );

    const [selectedSize, setSelectedSize] = useState(
        item.sizes.length > 0 ? item.sizes[0].name : ""
    );
    const changeQuantity = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    const { agregarAlCarrito } = useContext(CarritoContext);

    const addProduct = () => {
        agregarAlCarrito({
            ...item,
            quantity,
            selectedColor: item.colors?.length > 0 ? selectedColor : null,
            selectedSize: item.sizes?.length > 0 ? selectedSize : null,
        });
        // 2. Luego verificar si tiene ad y mostrar el modal
        if (item.ad && item.ad.image) {
            setIsModalOpen(true);
        }
    };
    const [mainImage, setMainImage] = useState(item.image);
    return (
        <section className=" py-10 bg-[#EFE5FF]">
            <div className="px-[5%] lg:px-0 mx-auto lg:max-w-5xl 2xl:max-w-6xl mt-8">
                <p className="md:w-[644px] mx-auto lg:mx-0 md:text-[18.31px] 2xl:text-[23.31px] leading-[29.44px]">
                    Home / Tienda weFem / <strong>{item.name}</strong>
                </p>

                <div className="flex items-start flex-col md:flex-row mt-4 gap-4">
                    <div className="mx-auto flex flex-col lg:flex-row justify-start items-start my-4 gap-8">
                        {/* Left Column - Images */}
                        <div className="hidden lg:flex items-start justify-start flex-col gap-4 w-[100px] h-full">
                            {item.images.length > 0 &&
                                item.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`/api/items/media/${image.url}`}
                                        alt="Thumbnail"
                                        className="h-[100px] w-[100px] object-cover"
                                        onClick={() => setMainImage(image.url)}
                                    />
                                ))}
                            {item.colors.length > 0 &&
                                item.colors.map((color, index) => (
                                    <img
                                        key={index}
                                        src={`/api/items/media/${color.image}`}
                                        alt="Thumbnail"
                                        className="h-[100px] w-[100px] object-cover"
                                        onClick={() =>
                                            setMainImage(color.image)
                                        }
                                    />
                                ))}
                        </div>

                        {/* Image */}
                        <div className="md:w-[644px] md:h-[644px] lg:w-[500.81px] lg:h-[500.81px] 2xl:w-[620.81px] 2xl:h-[620.81px] overflow-hidden">
                            <img
                                src={`/api/items/media/${mainImage}`}
                                alt={item.name}
                                className="md:w-[644px] md:h-[644px] lg:w-[500.81px] lg:h-[500.81px] 2xl:w-[620.81px] 2xl:h-[620.81px] object-cover rounded-lg"
                                loading="lazy"
                            />
                        </div>

                        <div className="flex items-start lg:hidden justify-start flex-row gap-4 w-full overflow-x-auto h-full">
                            {item.images.length > 0 &&
                                item.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`/api/items/media/${image.url}`}
                                        alt="Thumbnail"
                                        className="h-[100px] w-[100px] object-cover rounded-xl"
                                        onClick={() => setMainImage(image.url)}
                                    />
                                ))}
                            {item.colors.length > 0 &&
                                item.colors.map((color, index) => (
                                    <img
                                        key={index}
                                        src={`/api/items/media/${color.image}`}
                                        alt="Thumbnail"
                                        className="h-[100px] w-[100px] object-cover rounded-xl"
                                        onClick={() =>
                                            setMainImage(color.image)
                                        }
                                    />
                                ))}
                        </div>
                        {/* Product Details */}
                        <div className="md:w-[644px] lg:w-[350px] 2xl:w-[475px] text-[#333333]">
                            <div className="flex gap-4 lg:block items-end">
                                <h3 className="text-[30.58px] md:text-[55.58px] lg:text-[40.38px] 2xl:text-[54.38px] font-bold leading-[40.78px]">
                                    {item.name}
                                </h3>
                                <p className="text-[17.5px] md:text-[31.5px] lg:text-[16.81px] 2xl:text-[30.81px]  font-normal inline-flex ">
                                    ({item.summary})
                                </p>
                            </div>
                            <p className="text-[12.36px] md:text-[14.36px] lg:text-[11px] 2xl:text-[14.05px] mt-2 leading-relaxed ">
                                <img
                                    src="/assets/img/emojis/blossom.png"
                                    className="h-[15.05px] inline-flex"
                                />{" "}
                                {item.description}
                                <img
                                    src="/assets/img/emojis/crescent-moon.png"
                                    className="h-[15.05px] inline-flex"
                                />
                                <img
                                    src="/assets/img/emojis/sparkling-heart.png"
                                    className="h-[15.05px] inline-flex"
                                />
                            </p>
                            <div className="w-[158.43px] 2xl:w-[155px] h-[20px] 2xl:h-[25px] bg-[#212529] text-white rounded-[5.44px] my-4 flex items-center justify-center">
                                {item.discount && (
                                    <p className="w-[158.43px]   h-[25.55px]  bg-[#212529]  text-white rounded-[5.44px] my-4 flex items-center justify-center text-[10.88px]  leading-[21.75px]">
                                        <img
                                            src="/assets/img/emojis/fire.png"
                                            className="h-[11.88px] inline-flex mr-2"
                                        />{" "}
                                        <span className="font-bold text-[10.88px] mr-1">
                                            AHORRA
                                        </span>{" "}
                                        S/{" "}
                                        {Number(
                                            item.price - item.discount
                                        ).toFixed(2)}{" "}
                                        <img
                                            src="/assets/img/emojis/fire.png"
                                            className="h-[11.88px] inline-flex ml-2"
                                        />
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-4 lg:block items-end">
                                <p className="text-[30.42px] md:text-[50.42px] lg:text-[35.33px] 2xl:text-[49.33px] font-bold text-[#FC58BE]">
                                    S/ {Number(item.final_price).toFixed(2)}
                                </p>
                                <p className="text-[20.39px] md:text-[25.39px] lg:text-[18.84px] 2xl:text-[24.84px] text-[#B4B4B4]">
                                    <del>Antes S/ {item.price}</del>
                                </p>
                            </div>
                            {item.score > 4 && (
                                <div className="flex items-center mt-2 text-[#FF9900] gap-1 text-base">
                                    {Array.from({ length: item.score }).map(
                                        (_, index) => (
                                            <img
                                                key={index}
                                                src="/assets/img/emojis/star-score.png"
                                                className="h-[19px] inline-flex"
                                                alt="star"
                                            />
                                        )
                                    )}
                                </div>
                            )}
                            {/* Color Selector */}
                            <div className="relative flex justify-between sm:justify-start gap-4 lg:gap-0 lg:justify-between items-center  my-2">
                                {item.colors.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <p className="md:text-[10.05px] lg:text-[11px] 2xl:text-[14.05px] font-bold">
                                            Color:
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {item.colors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedColor(
                                                            color.name
                                                        );
                                                        setMainImage(
                                                            color.image
                                                        );
                                                    }}
                                                    className={`rounded-full p-1 border ${
                                                        selectedColor ===
                                                        color.name
                                                            ? "border-[#222222]"
                                                            : "border-[#DDDDDD]"
                                                    }`}
                                                >
                                                    <div
                                                        className="w-[22px] h-[22px] rounded-full "
                                                        style={{
                                                            backgroundColor: `${color.summary}`,
                                                        }}
                                                    ></div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {item.sizes.length > 0 && (
                                    <div className="lg:absolute right-0 lg:top-1/2  ">
                                        <button
                                            onClick={() =>
                                                setIsModalTalla(!isModalTalla)
                                            }
                                            className="inline-flex md:gap-2 2xl:gap-0 items-center justify-center w-[180.45px] 2xl:w-[187.45px] h-[34.02px] font-medium text-[12.05px] 2xl:text-[15.57px] leading-[15.95px] bg-[#5F48B7] text-white rounded-[8.51px]"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 fill-white mr-2"
                                                viewBox="0 0 640 512"
                                            >
                                                <path
                                                    d="M0 336c0 26.5 21.5 48 48 48l544 0c26.5 0 48-21.5
                48-48l0-160c0-26.5-21.5-48-48-48l-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0
                8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0
                8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0c-26.5
                0-48 21.5-48 48L0 336z"
                                                />
                                            </svg>
                                            ¿Cuál es mi talla?
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className=" block md:flex gap-4 lg:block items-end">
                                {/* Size Selector */}
                                {item.sizes.length > 0 && (
                                    <div className=" w-full md:w-1/2 lg:w-full mb-4 2xl:mb-6">
                                        <label className="md:text-[10.05px] lg:text-[11px] 2xl:text-[14.05px] font-bold">
                                            Selecciona tu talla:
                                        </label>
                                        <select
                                            className="w-full h-[40.94px] 2xl:h-[48.94px]  md:text-base 2xl:text-xl font-medium px-4 bg-[#EFEDF8] rounded-[5.44px] appearance-none  outline-none ring-0 border-0 cursor-pointer focus:outline-none"
                                            value={selectedSize}
                                            onChange={(e) =>
                                                setSelectedSize(e.target.value)
                                            }
                                        >
                                            {item.sizes.map((size) => {
                                                return (
                                                    <option
                                                        key={size.id}
                                                        value={size.name}
                                                        className="text-[#000000] md:text-base 2xl:text-xl font-medium"
                                                    >
                                                        {`Talla ${size.name}`}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                )}
                                {/* Quantity Selector */}
                                <div className=" w-full md:w-1/2 lg:w-full mb-4 2xl:mb-6">
                                    <div className=" flex h-[40.94px] text-[#000000]  bg-[#EFEDF8] items-center justify-around  rounded-[5.44px] ">
                                        <button
                                            onClick={() => changeQuantity(-1)}
                                            className="w-8 h-8 text-[17.84px] text-[#444444]"
                                        >
                                            -
                                        </button>
                                        <span className="md:text-base 2xl:text-xl font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => changeQuantity(1)}
                                            className="w-8 h-8 text-[17.84px] text-[#444444]"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => addProduct()}
                                    className="mt-4 relative w-full sm:w-[332px] lg:w-full h-[59px] lg:h-[35.88px] 2xl:h-[39.88px] text-[17.02px] lg:text-[12.59px]  2xl:text-[13.59px] leading-[13.59px] bg-[#FC58BE] text-white rounded-[6px]  lg:rounded-[2.72px] border-[1.81px] border-[#FC58BE]  flex items-center justify-center"
                                >
                                    <span className="">Añadir al carrito</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                        className="fill-white h-4 lg:h-3 absolute  top-1/2 -translate-y-1/2  right-16 "
                                    >
                                        <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}

            {item?.ad?.image &&
                isModalOpen &&
                new Date(item.ad.date_end) >= new Date() && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000080]"
                        style={{ backdropFilter: "blur(10px)" }}
                    >
                        <div className="relative flex items-center justify-center">
                            <button
                                className="absolute top-4 right-4 text-3xl text-[#9577B9]"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                            <div className="bg-white rounded-[30.58px]  2xl:rounded-[48.58px] md:w-[459px] md:h-[450.40px] 2xl:w-[819px] 2xl:h-[805.40px] flex flex-col items-center justify-center ">
                                <CountdownTimer
                                    startDate={item.ad.dete_begin}
                                    endDate={item.ad.date_end}
                                />
                                <div>
                                    <a href={item.ad.link}>
                                        <img
                                            src={`/api/ads/media/${item.ad.image}`}
                                            alt="Ad"
                                            className="w-full h-full object-cover rounded-[30.58px] 2xl:rounded-[48.58px]"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            {isModalTalla && (
                <div
                    className="fixed inset-0 min-h-screen flex items-center justify-center z-50 bg-[#00000080] transition-all duration-1000"
                    style={{ backdropFilter: "blur(10px)" }}
                >
                    <div
                        className="bg-white rounded-[30.58px] lg:w-[419px] lg:h-[405.40px] 2xl:w-[519px] 2xl:h-[505.40px] z-10  p-8 relative"
                        style={{
                            backgroundImage:
                                "url(/assets/img/multiple/mi-talla.png)",
                            backgroundSize: "cover",
                        }}
                    >
                        <button
                            className="absolute z-50 top-4 right-4 text-3xl text-[#9577B9]"
                            onClick={() => setIsModalTalla(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Detail;
