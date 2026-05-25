"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const cartStorage = localStorage.getItem('cart')
    setCart(cartStorage ? JSON.parse(cartStorage) : [])
  }, [])

  const updateCart = (newCart: any[]) => {
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const handleIncrease = (variation_id: number) => {
    const newCart = cart.map(item =>
      item.variation_id === variation_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
    updateCart(newCart)
  }

  const handleDecrease = (variation_id: number) => {
    const newCart = cart.map(item =>
      item.variation_id === variation_id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    )
    updateCart(newCart)
  }

  const handleRemove = (variation_id: number) => {
    const newCart = cart.filter(item => item.variation_id !== variation_id)
    updateCart(newCart)
  }

  const handleCheckout = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    // implementar checkout depois
    console.log('Checkout:', cart)
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-32 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.variation_id} className="bg-white rounded-2xl p-6 mb-4 flex items-center gap-6 shadow-sm">
              <img src={item.url_image} alt={item.product_name} className="w-24 h-24 object-contain" />

              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.product_name}</h2>
                <p className="text-gray-500 text-sm">{item.storage} · {item.color}</p>
                <p className="font-bold mt-1">{Number(item.price).toLocaleString()} MZN</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button onClick={() => handleDecrease(item.variation_id)} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-gray-100">
                  −
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button onClick={() => handleIncrease(item.variation_id)} className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-gray-100">
                  +
                </button>
              </div>

              {/* Remove */}
              <button onClick={() => handleRemove(item.variation_id)} className="text-red-500 text-sm hover:underline">
                Remove
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">{total.toLocaleString()} MZN</span>
          </div>

          <button onClick={handleCheckout} className="w-full bg-black text-white font-bold py-4 rounded-full mt-6 text-base active:scale-95 transition-transform">
            Checkout
          </button>
        </>
      )}
    </main>
  )
}