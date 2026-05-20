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

export default async function AirpodsPage() {
  const products = await getProducts("airpods");
  
  const seriesAirpodsMax = products.filter((p: any) => p.product_name.includes("airpods"));
  const seriesAirpods2dn = products.filter((p: any) => p.product_name.includes("airpods"));

  const renderRow = (title: string, items: any[]) => (
    <div className="mb-12">
      <div className="max-w-7xl mx-auto px-6 mb-4">
         <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-8 scrollbar-hide">
        {items.map((product: any) => (
          <div key={product.id} className="snap-center shrink-0">
            <ProductsCard product={product} />
          </div>
        ))}
        <div className="shrink-0 w-6" />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-32">
      {renderRow("Airpods Max", seriesAirpodsMax)}
      {renderRow("Airpods 2dn", seriesAirpods2dn)}
    </main>
  );
}