import ProductsCard from "../components/ProductsCard";
import "dotenv/config";

async function getProducts(brand: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/brand/${brand}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

export default async function IphonesPage() {
  const products = await getProducts("Samsung");
  
  const seriesS23 = products.filter((p: any) => p.product_name.includes("S23"));
  const seriesS24 = products.filter((p: any) => p.product_name.includes("S24"));
  const seriesS25 = products.filter((p: any) => p.product_name.includes("S25"));
  const seriesS26 = products.filter((p: any) => p.product_name.includes("S26"));

  const renderRow = (title: string, items: any[]) => (
    <div className="mb-12">
      {/* Título da Linha opcional ou apenas o espaço */}
      <div className="max-w-7xl mx-auto px-6 mb-4">
         <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      
      {/* Container do Carrossel */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-8 scrollbar-hide">
        {items.map((product: any) => (
          <div key={product.id} className="snap-center shrink-0">
            <ProductsCard product={product} />
          </div>
        ))}
        {/* Espaçador final para o scroll não colar na borda direita */}
        <div className="shrink-0 w-6" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-32">
      {renderRow("Samsung S23 Series", seriesS23)}
      {renderRow("Samsung S24 Series", seriesS24)}
      {renderRow("Samsung S25 Series", seriesS25)}
      {renderRow("Samsung S26 Series", seriesS26)}
    </main>
  );
}