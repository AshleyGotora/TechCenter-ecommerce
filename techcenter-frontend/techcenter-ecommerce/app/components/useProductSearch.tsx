import { useState, useEffect, useRef, useCallback } from "react";

export interface Product {
  id: string | number;
  product_name: string;
}

export function useProductSearch(query: string) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?search=${encodeURIComponent(q)}`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) { setSuggestions([]); return; }
      const data = await res.json();
      setSuggestions(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setSuggestions([]); return; }
    timerRef.current = setTimeout(() => fetchProducts(query.trim()), 350);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, fetchProducts]);

  return { suggestions, isLoading };
}