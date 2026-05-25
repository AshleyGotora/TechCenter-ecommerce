import ProductDetail from "../../components/ProductDetails"

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
      cache: 'no-cache'
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getProduct(id)

  if (!data) return <p>Product not found!</p>

  const { product, variations } = data

  return <ProductDetail product={product} variations={variations} />
}