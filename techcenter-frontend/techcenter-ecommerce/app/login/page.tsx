"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const router = useRouter(); // aqui, fora de qualquer função

  const sendData = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setMessage({ text: 'Account logged in successfully!', isError: false });
        router.push('/')
      } else {
        setMessage({ text: data.error || 'Something went wrong!', isError: true });
      }
    } catch (error) {
      console.error("Failed connect to the server", error);
      setMessage({ text: 'We had problems connecting to the server!', isError: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center px-4 py-8">
      <form
        className="bg-white p-8 shadow-xl w-full max-w-sm flex flex-col items-center border border-gray-200 md:max-w-md"
      >
        <h1 className="font-[family-name:var(--font-js)] font-bold text-4xl mb-8 tracking-tighter text-black uppercase">
          login
        </h1>

        {message.text && (
          <div className={`w-full p-3 mb-6 rounded-xl text-sm font-medium text-center border ${
            message.isError
              ? 'bg-red-50 text-red-600 border-red-200'
              : 'bg-green-50 text-green-600 border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="w-full space-y-4 mb-6">
          <label htmlFor="email" className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Email
            <input
              id="email"
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-xl text-black text-base outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label htmlFor="password" className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Password
            <input
              id="password"
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-xl text-black text-base outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={sendData}
          className="w-full bg-black text-white font-bold py-3 rounded-xl mb-4 hover:-translate-y-1 transition-transform active:scale-95 uppercase tracking-wide"
        >
          To Enter
        </button>

        <button
          type="button"
          className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Login with Google
        </button>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs">
            Not registered?
            <Link href="/signup" className="text-xs font-semibold underline text-gray-500 hover:text-black transition-colors duration-150 ml-2">
              Create account
            </Link>
          </p>
          <Link href="/forgot-password" className="text-xs font-semibold underline text-gray-500 hover:text-black transition-colors duration-150">
            Forgot password
          </Link>
        </div>
      </form>
    </div>
  );
}