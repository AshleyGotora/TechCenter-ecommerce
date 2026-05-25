"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const variations = product.variations || [];

  const storages = [
    ...new Set(variations.map((v: any) => v.storage)),
  ];

  const colors = [
    ...new Map(
      variations.map((v: any) => [v.color, v])
    ).values(),
  ];

  const [selectedStorage, setSelectedStorage] = useState(
    storages[0]
  );

  const [selectedColor, setSelectedColor] = useState<any>(
    colors[0]
  );

  const [quantity, setQuantity] = useState<number>(1);

  const activeVariation =
    variations.find(
      (v: any) =>
        v.storage === selectedStorage &&
        v.color === selectedColor?.color
    ) || variations[0];

  const handleAddToCart = () => {
    const cartStorage = localStorage.getItem("cart");

    const cart = cartStorage
      ? JSON.parse(cartStorage)
      : [];

    const existing = cart.find(
      (item: any) =>
        item.variation_id === activeVariation.id
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        variation_id: activeVariation.id,
        product_name: product.product_name,
        color: activeVariation.color,
        storage: activeVariation.storage,
        url_image: activeVariation.url_image,
        price: activeVariation.price,
        quantity,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    router.push("/cart");
  };

  const handleSeeMore = () => {
    router.push(`/product/${product.id}`);
  };

  if (!activeVariation) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-[35px] p-6 lg:p-10 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] min-h-[700px] w-[90vw] min-w-[90vw] lg:w-[561px] lg:min-w-[561px] transition-all duration-500 ease-in-out">

      {/* TITLE */}
      <h3 className="font-bold text-2xl lg:text-3xl text-center tracking-tight text-[#1d1d1f] pb-3 border-b border-black w-full mb-6 lg:mb-8 uppercase">
        {product.product_name}
      </h3>

      {/* IMAGE */}
      <div className="w-full h-[260px] lg:h-[300px] flex items-center justify-center mb-6 lg:mb-10">
        <img
          src={activeVariation.url_image}
          alt={product.product_name}
          className="max-w-full max-h-full object-contain object-center transition-transform duration-500 ease-out hover:scale-105"
        />
      </div>

      {/* STORAGE */}
      <div className="flex justify-center gap-4 lg:gap-6 mb-6 lg:mb-10">
        {storages.map((storage: any) => (
          <button
            key={storage}
            onClick={() =>
              setSelectedStorage(storage)
            }
            className={`relative group px-1 py-1.5 transition-all duration-300 touch-manipulation
              ${
                selectedStorage === storage
                  ? "text-black font-bold"
                  : "text-gray-400 hover:text-black"
              }`}
          >
            <span className="relative z-10 text-sm">
              {storage}
            </span>

            <span
              className={`absolute left-0 bottom-0 h-[2px] bg-black transition-all duration-500 ease-out
              ${
                selectedStorage === storage
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </button>
        ))}
      </div>

      {/* COLORS */}
      <div className="flex gap-3 lg:gap-4 mb-4">
        {colors.map((variation: any) => (
          <button
            key={variation.color}
            onClick={() =>
              setSelectedColor(variation)
            }
            className={`w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] rounded-full border-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 touch-manipulation hover:scale-110
              ${
                selectedColor?.color ===
                variation.color
                  ? "border-blue-500 outline outline-2 outline-blue-500 outline-offset-2 scale-110"
                  : "border-transparent"
              }`}
            style={{
              backgroundColor: variation.circle,
            }}
          />
        ))}
      </div>

      {/* COLOR NAME */}
      <div className="mb-6 uppercase text-sm tracking-wide text-[#1d1d1f]">
        <p>{activeVariation.color}</p>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-3 lg:gap-4 w-full mt-4">

        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-3 lg:py-4 rounded-full text-base transition-transform active:scale-95 duration-200 hover:opacity-90"
        >
          Add in Cart
        </button>

        <button
          onClick={handleSeeMore}
          className="group relative w-fit mx-auto text-black font-medium py-2 text-base"
        >
          See more

          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-500 ease-out group-hover:w-full"></span>
        </button>
      </div>
    </div>
  );
}