"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Minus } from "lucide-react"

export default function ProductDetail({ product, variations }: { product: any, variations: any[] }) {
  const storages = [...new Set(variations.map((v: any) => v.storage))] as string[]
  const [selectedStorage, setSelectedStorage] = useState(storages[0])
  const [selectedColor, setSelectedColor] = useState<any>(variations[0])

  const colors = [...new Map(
    variations
      .filter((v: any) => v.storage === selectedStorage)
      .map((v: any) => [v.color, v])
  ).values()]

  const activeVariation = variations.find(
    (v: any) => v.storage === selectedStorage && v.color === selectedColor?.color
  ) ?? variations[0]

  const router = useRouter();

  const handleBuy = () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login')
      return;
    }

    console.log('Comprar:', activeVariation);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Images */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-12 min-h-[50vh] lg:min-h-screen">
        <img
          src={activeVariation.url_image}
          alt={product.product_name}
          className="max-w-[400px] w-full object-contain transition-all duration-500"
        />
      </div>

      {/* Details */}
      <div className="lg:w-1/2 bg-[#F5F5F7] flex flex-col justify-center px-10 lg:px-20 py-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1d1d1f] mb-8">
          {product.product_name}
        </h1>

        <hr className="mb-5 text-gray-300"/>

        {/* Storage */}
        <div className="mb-6">
          <p className="text-md text-black mb-3 font-bold">STORAGE :</p>
          <div className="flex gap-3">
            {storages.map((s: any) => (
              <button
                key={s}
                onClick={() => setSelectedStorage(s)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
                  ${selectedStorage === s
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <hr className="mb-5 text-gray-300"/>

        {/* Colors */}
        <div className="mb-8">
          <div className="flex "><p className="text-md text-black mb-3"><p className="font-bold">COLOUR :</p> {selectedColor?.color}</p></div>
          <div className="flex gap-3">
            {colors.map((v: any) => (
              <button
                key={v.color}
                onClick={() => setSelectedColor(v)}
                className={`w-8 h-8 lg:w-[26px] lg:h-[26px] rounded-full border-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 touch-manipulation hover:scale-110
                  ${selectedColor?.color === v.color
                    ? 'border-blue-500 outline outline-2 outline-blue-500 outline-offset-2 scale-110'
                    : 'border-transparent'}`}
                style={{ backgroundColor: v.circle }}
              />
            ))}
          </div>
        </div>

        <hr className="mb-5 text-gray-300"/>

        {/* Price */}
        <p className="text-2xl font-bold text-[#1d1d1f] mb-8">
          {Number(activeVariation.price).toLocaleString()} MZN
        </p>

        {/* Quantity */}

        {/* Button */}
        <div className="flex items-center gap-4 w-full">
            <button className="bg-[#F5F5F7] border border-black rounded-full w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-200 transition-all duration-300 ease-in">
                <Plus size={20} text-black/>
            </button>
            <button onClick={handleBuy} className="flex-1 bg-black text-white font-bold py-4 rounded-full text-base transition-transform active:scale-95 duration-200">
                Buy
            </button>
            <button className="bg-[#F5F5F7] border border-black rounded-full w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-200 transitions-all duration-300 ease-in">
                <Minus size={20} text-white />
            </button>
        </div>
      </div>
    </div>
  )
}