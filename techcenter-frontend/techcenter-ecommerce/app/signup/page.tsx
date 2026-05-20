"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ← ADICIONADO: para poder redirecionar

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ text: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // ← ADICIONADO: aqui fora de qualquer função

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", isError: false });

    if (Object.values(formData).some((field) => field.trim() === "")) {
      return setMessage({ text: "Please fill in all fields.", isError: true });
    }

    if (formData.password !== formData.confirmPassword) {
      return setMessage({ text: "Passwords don't match!", isError: true });
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setMessage({ text: "Account created successfully!", isError: false });
      
      setTimeout(() => {
        router.replace('/') // ← ADICIONADO: redireciona para login após 1.5s
      }, 1500);

      setFormData({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Connection error.";
      setMessage({
        text: errorMessage,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center border border-gray-200 md:max-w-md"
      >
        <h1 className="font-bold text-4xl mb-8 tracking-tighter text-black uppercase">
          sign-up
        </h1>

        {message.text && (
          <div
            className={`w-full p-3 mb-6 rounded-xl text-sm font-medium text-center border ${
              message.isError
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-green-50 text-green-600 border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="w-full space-y-4 mb-6">
          <input
            name="name"
            type="text"
            placeholder="Name"
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-xl text-black outline-none focus:border-black transition-all"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="surname"
            type="text"
            placeholder="Surname"
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-xl text-black outline-none focus:border-black transition-all"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-xl text-black outline-none focus:border-black transition-all"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-xl text-black outline-none focus:border-black transition-all"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-xl text-black outline-none focus:border-black transition-all"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-black text-white font-bold py-3 rounded-xl uppercase tracking-wide mb-4 transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-1 active:scale-95"
          }`}
        >
          {isLoading ? "Creating..." : "Sign Up"}
        </button>

        <Link
          href="/login"
          className="text-xs font-semibold underline text-gray-500 uppercase hover:text-black"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}