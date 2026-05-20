/*import Image from "next/image";
import Link from "next/link";
import "dotenv/config"

type Product = {
  id: number;
  product_name: string;
  url_image: string;
  price: number;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function StorePage() {
  const products = await getProducts();

  return (
    <main className="pt-24 px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link href={`/product/${p.id}`} key={p.id}>
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center
                            hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-[family-name:var(--font-cc)] text-xl mb-3
                             border-b-2 border-black w-full text-center pb-2">
                {p.product_name}
              </h3>
              <div className="relative w-44 h-44 my-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${p.url_image}`}
                  alt={p.product_name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                A partir de{" "}
                <span className="font-bold text-black">
                  {Number(p.price).toLocaleString("pt-MZ")} MZN
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

*/