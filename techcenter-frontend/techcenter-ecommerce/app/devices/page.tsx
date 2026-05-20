import ProductDetail from "@/app/components/variations";

type Props = { params: { id: string } };

async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function ProductPage({ params }: Props) {
  const data = await getProduct(params.id);
  return <ProductDetail data={data} />;
}