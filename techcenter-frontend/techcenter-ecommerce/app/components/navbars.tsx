"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, Loader2 } from "lucide-react";
import { useProductSearch } from "../components/useProductSearch";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, isLoading } = useProductSearch(searchTerm);

  // Abre/fecha dropdown conforme as sugestões
  useEffect(() => {
    setShowDropdown(suggestions.length > 0 && searchTerm.trim().length >= 2);
    setActiveIndex(-1);
  }, [suggestions, searchTerm]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Foca o input ao abrir a busca desktop
  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch();
  };

  const submitSearch = () => {
    if (!searchTerm.trim()) return;
    setShowDropdown(false);
    setOpen(false);
    setShowSearch(false);
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelect = (product: { id: string | number; product_name: string }) => {
    setSearchTerm(product.product_name);
    setShowDropdown(false);
    setOpen(false);
    setShowSearch(false);
    router.push(`/produtos/${product.id}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const highlight = (text: string) => {
    const q = searchTerm.trim();
    if (!q) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <mark className="bg-yellow-100 text-inherit rounded-sm px-px">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </span>
    );
  };

  // Dropdown reutilizado no desktop e mobile
  const Dropdown = () => (
    <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
      {suggestions.map((product, idx) => (
        <li key={product.id}>
          <button
            onMouseDown={(e) => { e.preventDefault(); handleSelect(product); }}
            onMouseEnter={() => setActiveIndex(idx)}
            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors
              ${idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <Search size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-800">{highlight(product.product_name)}</span>
          </button>
        </li>
      ))}
      <li className="border-t border-gray-100">
        <button
          onMouseDown={(e) => { e.preventDefault(); submitSearch(); }}
          className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 font-medium hover:bg-gray-50 flex items-center gap-2"
        >
          <Search size={14} className="shrink-0" />
          Ver todos os resultados para &quot;{searchTerm}&quot;
        </button>
      </li>
    </ul>
  );

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      <div className="w-full mx-auto px-6 h-16 flex items-center justify-between relative">

        {/* 1. LOGO */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/TECHCENTER.png"
            alt="TECHCENTER"
            width={236}
            height={32}
            className="w-[180px] h-auto md:w-[236px]"
          />
        </Link>

        {/* 2. LINKS DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-semibold bg-black text-white px-4 py-1 rounded-full text-base hover:-translate-y-0.5 transition-transform active:scale-95">
            Store
          </Link>
          <Link href="/iphones" className="text-base font-medium hover:-translate-y-0.5 transition-transform">iPhones</Link>
          <Link href="/samsungs" className="text-base font-medium hover:-translate-y-0.5 transition-transform">Samsungs</Link>
          <Link href="/macbooks" className="text-base font-medium hover:-translate-y-0.5 transition-transform">Macbooks</Link>
          <Link href="/airpods" className="text-base font-medium hover:-translate-y-0.5 transition-transform">Airpods</Link>
          <Link href="/airpods" className="text-base font-medium hover:-translate-y-0.5 transition-transform">About us</Link>

          {/* BUSCA DESKTOP com autocomplete */}
          <div className="flex items-center gap-4 border-l pl-6 ml-2">
            <div ref={wrapperRef} className="relative flex items-center">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                  autoComplete="off"
                  className={`transition-all duration-300 outline-none text-sm border-b border-black
                    ${showSearch ? "w-40 opacity-100 px-2" : "w-0 opacity-0 pointer-events-none"}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (showSearch && searchTerm.trim()) { submitSearch(); return; }
                    setShowSearch(!showSearch);
                    if (showSearch) { setSearchTerm(""); setShowDropdown(false); }
                  }}
                  className="hover:opacity-60 p-1"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>
              </form>

              {showDropdown && showSearch && <Dropdown />}
            </div>

            <button className="hover:opacity-60 transition-opacity">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* 3. MOBILE ACTIONS */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => { setOpen(true); setShowSearch(true); }} className="hover:opacity-60">
            <Search size={22} />
          </button>
          <button className="hover:opacity-60"><ShoppingCart size={22} /></button>
          <button className="text-black" onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* 4. MOBILE MENU */}
      <div className={`
        md:hidden absolute top-[64px] left-0 w-full bg-white border-b border-gray-100
        flex flex-col p-6 gap-6 shadow-xl items-center z-50
        transition-all duration-500 ease-in-out overflow-visible
        ${open ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}
      `}>

        {/* Busca mobile com autocomplete */}
        <div className="relative w-full max-w-xs">
          <form onSubmit={handleSearch} className="w-full flex justify-center">
            <div className="relative w-full flex items-center border-b border-gray-300 focus-within:border-black transition-colors">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                className="w-full py-2 outline-none text-center text-sm bg-transparent"
              />
              {isLoading && <Loader2 size={16} className="animate-spin text-gray-400 shrink-0" />}
            </div>
          </form>
          {showDropdown && open && <Dropdown />}
        </div>

        <Link href="/" onClick={() => setOpen(false)} className="text-lg font-medium">Store</Link>
        <Link href="/iphones" onClick={() => setOpen(false)} className="text-lg font-medium">iPhones</Link>
        <Link href="/samsungs" onClick={() => setOpen(false)} className="text-lg font-medium">Samsungs</Link>
        <Link href="/macbooks" onClick={() => setOpen(false)} className="text-lg font-medium">Macbooks</Link>
        <Link href="/airpods" onClick={() => setOpen(false)} className="text-lg font-medium">Airpods</Link>
        <Link href="/about-us" onClick={() => setOpen(false)} className="text-lg font-medium">About us</Link>
      </div>
    </nav>
  );
}