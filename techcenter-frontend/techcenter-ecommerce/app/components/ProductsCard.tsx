"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const variations = product.variations || [];
  const storages = [...new Set(variations.map((v: any) => v.storage))];
  const colors = [...new Map(variations.map((v: any) => [v.color, v])).values()];

  const [selectedStorage, setSelectedStorage] = useState(storages[0]);
  const [selectedColor, setSelectedColor] = useState<any>(colors[0]);
  const router = useRouter();

  const activeVariation = variations.find(
    (v: any) => v.storage === selectedStorage && v.color === selectedColor?.color
  ) ?? variations[0];

  const handleBuy = () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token'); // verifica se tem token
    if (!token) {
      router.push('/login')
      return;
    }
    // tem conta → continua com a compra (implementar depois)
    console.log('Comprar:', activeVariation);
  };

  const handleSeeMore = () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // tem conta → continuar (implementar depois)
    console.log('Ver mais:', activeVariation);
  };

  if (!activeVariation) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-[35px] p-6 lg:p-10 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] h-auto lg:h-[755px] w-[90vw] min-w-[90vw] lg:w-[561px] lg:min-w-[561px] transition-all duration-500 ease-in-out">
      
      <h3 className="font-bold text-2xl lg:text-3xl text-center tracking-tight text-[#1d1d1f] pb-3 border-b border-black w-full mb-6 lg:mb-8">
        {product.product_name}
      </h3>

      <div className="w-full h-[260px] lg:h-[300px] flex items-center justify-center mb-6 lg:mb-10">
        <img
          src={activeVariation.url_image}
          alt={product.product_name}
          className="max-w-full max-h-full object-contain object-center transition-transform duration-500 ease-out"
        />
      </div>

      <div className="flex justify-center gap-4 lg:gap-6 mb-6 lg:mb-10">
        {storages.map((s: any) => (
          <button
            key={s}
            onClick={() => setSelectedStorage(s)}
            className={`relative group px-1 py-1.5 transition-all duration-300 touch-manipulation
              ${selectedStorage === s ? "text-black font-bold" : "text-gray-400 hover:text-black"}`}
          >
            <span className="relative z-10 text-sm">{s}</span>
            <span className={`absolute left-0 bottom-0 h-[2px] bg-black transition-all duration-500 ease-out
              ${selectedStorage === s ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
          </button>
        ))}
      </div>

      <div className="flex gap-3 lg:gap-4 mb-6 lg:mb-12">
        {colors.map((v: any) => (
          <button
            key={v.color}
            onClick={() => setSelectedColor(v)}
            className={`w-[22px] h-[22px] lg:w-[26px] lg:h-[26px] rounded-full border-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 touch-manipulation hover:scale-110
              ${selectedColor?.color === v.color ? "border-blue-500 outline outline-2 outline-blue-500 outline-offset-2 scale-110" : "border-transparent"}`}
            style={{ backgroundColor: v.circle }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:gap-4 w-full mt-auto">
        <button
          onClick={handleBuy}
          className="w-full bg-black text-white font-bold py-3 lg:py-4 rounded-full text-base transition-transform active:scale-95 duration-200">
          Buy
        </button>
        <button
          onClick={handleSeeMore}
          className="group relative w-fit mx-auto text-black font-medium py-2 text-base">
          See more
          <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-500 ease-out group-hover:w-full"></span>
        </button>
      </div>
    </div>
  );
}