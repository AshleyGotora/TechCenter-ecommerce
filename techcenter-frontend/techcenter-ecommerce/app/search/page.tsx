"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Product {
  id: string | number;
  product_name: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q.trim()) return;
    const controller = new AbortController();
    setIsLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?q=${encodeURIComponent(q)}`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [q]);

  return (
    <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          {q ? `Resultados para "${q}"` : "Pesquisar"}
        </h1>
        {!isLoading && q && (
          <p className="text-gray-500 text-sm mt-1">
            {total} produto{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <ul className="flex flex-col gap-3">
          {results.map((product) => (
            <li key={product.id}>
              <a href={`/produtos/${product.id}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-black transition-colors">
                <span className="font-medium text-gray-900">{product.product_name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && q && results.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium text-gray-600">Nenhum produto encontrado</p>
          <p className="text-sm mt-2">Tenta pesquisar por outro nome.</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}