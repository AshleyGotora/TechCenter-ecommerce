"use client";
import { useState } from "react";
import Image from "next/image";

type Variation = {
  id: number;
  color: string;
  circle: string;
  url_image: string;
  storage: string;
  price: number;
};

type ProductData = {
  product: { id: number; product_name: string; description: string };
  variations: Variation[];
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail({ data }: { data: ProductData }) {
  const { product, variations } = data;

  // Cores únicas
  const colors = [...new Map(variations.map(v => [v.color, v])).values()];
  // Armazenamentos únicos
  const storages = [...new Set(variations.map(v => v.storage))];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(storages[0]);

  // Variação activa = cor + armazenamento seleccionados
  const current = variations.find(
    (v) => v.color === selectedColor.color && v.storage === selectedStorage
  );

  const handleColorChange = (color: Variation) => {
    setSelectedColor(color);
    const exists = variations.find(
      (v) => v.color === color.color && v.storage === selectedStorage
    );
    if (!exists) {
      const first = variations.find((v) => v.color === color.color);
      if (first) setSelectedStorage(first.storage);
    }
  };

  return (
    <main className="pt-28 px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Imagem */}
        <div className="bg-white rounded-2xl p-10 flex items-center justify-center min-h-80">
          <div className="relative w-64 h-64">
            <Image
              key={current?.url_image}
              src={`${API}${current?.url_image ?? selectedColor.url_image}`}
              alt={product.product_name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="font-[family-name:var(--font-cc)] text-4xl mb-6">
            {product.product_name}
          </h1>

          {/* Armazenamento */}
          <div className="flex gap-3 mb-5 flex-wrap">
            {storages.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStorage(s)}
                className={`border border-black rounded-xl px-5 py-2 text-sm font-bold
                            font-[family-name:var(--font-js)] transition-colors
                            ${selectedStorage === s
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-gray-100"
                            }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Cores */}
          <div className="flex gap-3 mb-4">
            {colors.map((c) => (
              <button
                key={c.color}
                onClick={() => handleColorChange(c)}
                title={c.color}
                className={`w-9 h-9 rounded-full transition-transform hover:scale-110
                            ${selectedColor.color === c.color
                              ? "ring-2 ring-black ring-offset-2"
                              : ""
                            }`}
                style={{ backgroundColor: c.circle }}
              />
            ))}
          </div>

          {/* Cor activa */}
          <p className="text-sm text-gray-400 mb-3">
            Cor: <span className="font-bold text-black">{selectedColor.color}</span>
          </p>

          {/* Preço */}
          <p className="text-xl font-bold mb-6">
            Preço:{" "}
            {current
              ? Number(current.price).toLocaleString("pt-MZ") + " MZN"
              : "—"}
          </p>

          {/* Descrição */}
          <pre className="text-sm text-gray-500 whitespace-pre-wrap mb-6
                          font-[family-name:var(--font-js)] leading-relaxed">
            {product.description}
          </pre>

          <button className="w-full bg-black text-white rounded-full py-3 font-bold
                             hover:bg-gray-800 transition-colors">
            Comprar
          </button>
        </div>
      </div>
    </main>
  );
}