import ProductCard from "../components/ProductsCard";
import "dotenv/config";


async function GetAllProduct() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            cache: "no-store"
        })
        const data = res.json();
        const products = Array.isArray(data) ? data : []

        const shuffle = (array: any[]) => {
            return array.sort(() => Math.random() - 0.5)
        };

        const randomProducts = shuffle(products).slice(0, 12)
    } catch {
        return []
    }
}

export default async function Store() {
    const Products = await GetAllProduct();

    

}