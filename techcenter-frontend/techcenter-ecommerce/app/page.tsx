"use client"

import Image from "next/image";
import Logo from "../public/images/TECHCENTER.png";
import IphoneBackground from "../public/images/Iphone_bg.webp";
import SamsungBackground from "../public/images/Samsung_bg.webp";
import MacbookBackground from "../public/images/Macbook_bg.webp";
import AirpodsBackground from "../public/images/Airpods_bg.webp";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="w-full flex flex-col items-center overflow-x-hidden">

      <section className="min-h-screen w-full flex flex-col justify-center items-start px-6 md:px-16 text-left gap-2">
        <p className="inline-flex items-center gap-1 text-sm font-light">
          Why trust <Image src={Logo} alt="TECHCENTER" width={120} height={10} className="w-[120px] h-[10px]"/>?
        </p>
        <h2 className="text-3xl mb-10 md:text-6xl lg:text-[72px] font-light max-w-[959px] leading-tight">
          We provide high-end devices at a good price with a 1-year warranty
        </h2> 
      </section>

      <section className="w-full py-20 flex flex-col items-center gap-8 border-t border-gray-100">
        <div className="text-center max-w-2xl px-4">
          <h2 className="text-4xl md:text-6xl font-medium mb-2">iPhone</h2>
          <p className="text-xl md:text-2xl text-blue-600 font-medium mb-3">Starting from 24,000 MZN</p>
          <p className="text-gray-500 text-md md:text-xl font-light">
            Innovation at your fingertips. The perfect balance between power and elegance.
          </p>
        </div>
        <Image src={IphoneBackground} alt="IPHONES" width={1440} height={787} className="w-full max-w-7xl h-auto" />
        <button onClick={() => router.push('/iphones')} className="ring-2 ring-inset ring-white bg-black rounded-full text-white py-3 px-8 font-light transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black hover:ring-black">
          See more
        </button>
      </section>

      <section className="w-full py-20 flex flex-col items-center gap-8 border-t border-gray-100">
        <div className="text-center max-w-2xl px-4">
          <h2 className="text-4xl md:text-6xl font-medium mb-2">Samsung</h2>
          <p className="text-gray-500 text-md md:text-lg font-light">
            Redefine what's possible with cutting-edge technology and immersive displays.
          </p>
        </div>
        <Image src={SamsungBackground} alt="SAMSUNGS" width={1440} height={787} className="w-full max-w-7xl h-auto" />
        <button onClick={() => router.push('/samsungs')} className="ring-2 ring-inset ring-white bg-black rounded-full text-white py-3 px-8 font-light transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black hover:ring-black">
          See more
        </button>
      </section>

      <section className="w-full py-20 flex flex-col items-center gap-8 border-t border-b border-gray-100 mb-20">
        <div className="text-center max-w-2xl px-4">
          <h2 className="text-4xl md:text-6xl font-medium mb-2">Macbook</h2>
          <p className="text-gray-500 text-md md:text-lg font-light">
            Where intelligence meets absolute speed.
          </p>
        </div>
        <Image src={MacbookBackground} alt="MACBOOKS" width={1440} height={787} className="w-full max-w-7xl h-auto" />
        <button onClick={() => router.push('/macbooks')} className="ring-2 ring-inset ring-white bg-black rounded-full text-white py-3 px-8 font-light transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black hover:ring-black">
          See more
        </button>
      </section>

      <section className="w-full py-20 flex flex-col items-center gap-8 border-t border-b border-gray-100 mb-20">
        <div className="text-center max-w-2xl px-4">
          <h2 className="text-4xl md:text-6xl font-medium mb-2">Airpods</h2>
          <p className="text-gray-500 text-md md:text-lg font-light">
            Feel every beat. Pure sound, zero distractions.
          </p>
        </div>
        <Image src={AirpodsBackground} alt="AIRPODS" width={1440} height={787} className="w-full max-w-7xl h-auto" />
        <button onClick={() => router.push('/airpods')} className="ring-2 ring-inset ring-white bg-black rounded-full text-white py-3 px-8 font-light transition-all duration-300 hover:scale-110 hover:bg-white hover:text-black hover:ring-black">
          See more
        </button>
      </section>

    </main>
  );
}