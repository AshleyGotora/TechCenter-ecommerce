"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  variation_id: number;
  product_name: string;
  storage: string;
  color: string;
  url_image: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cartStorage = localStorage.getItem("cart");

    if (cartStorage) {
      setCart(JSON.parse(cartStorage));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleIncrease = (variation_id: number) => {
    const newCart = cart.map((item) =>
      item.variation_id === variation_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(newCart);
  };

  const handleDecrease = (variation_id: number) => {
    const newCart = cart.map((item) =>
      item.variation_id === variation_id
        ? {
            ...item,
            quantity: item.quantity > 1 ? item.quantity - 1 : 1,
          }
        : item
    );

    updateCart(newCart);
  };

  const handleRemove = (variation_id: number) => {
    const newCart = cart.filter(
      (item) => item.variation_id !== variation_id
    );

    updateCart(newCart);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    console.log("Checkout:", cart);

    // checkout depois
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-32 px-4 md:px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <p className="text-gray-500 text-center">
            Your cart is empty.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.variation_id}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={item.url_image}
                    alt={item.product_name}
                    className="w-20 h-20 object-contain shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base truncate">
                      {item.product_name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {item.storage} · {item.color}
                    </p>

                    <p className="font-bold mt-1">
                      {Number(item.price).toLocaleString()} MZN
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleDecrease(item.variation_id)
                      }
                      className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      −
                    </button>

                    <span className="font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleIncrease(item.variation_id)
                      }
                      className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleRemove(item.variation_id)
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm mt-6">
            <span className="text-xl font-bold">Total</span>

            <span className="text-xl font-bold">
              {total.toLocaleString()} MZN
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white font-bold py-4 rounded-full mt-6 text-base active:scale-95 transition-transform"
          >
            Checkout
          </button>
        </>
      )}
    </main>
  );
}