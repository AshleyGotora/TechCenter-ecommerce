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
  const products = await getProducts("iphone");
  
  const series17 = products.filter((p: any) => p.product_name.includes("17"));
  const series16 = products.filter((p: any) => p.product_name.includes("16"));
  const series15 = products.filter((p: any) => p.product_name.includes("15"));
  const series14 = products.filter((p: any) => p.product_name.includes("14"));
  const series13 = products.filter((p: any) => p.product_name.includes("13"));

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
      {renderRow("iPhone 17 Series", series17)}
      {renderRow("iPhone 16 Series", series16)}
      {renderRow("iPhone 15 Series", series15)}
      {renderRow("iPhone 14 Series", series14)}
      {renderRow("iPhone 13 Series", series13)}
    </main>
  );
}