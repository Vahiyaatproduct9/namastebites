"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MenuItem, useCart } from "@/app/store/useCart";

export default function MenuItemPage() {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchMenuItem() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const menuItems: MenuItem[] = await response.json();
        const foundItem = menuItems.find((item) => item.id === id);
        if (foundItem) {
          setMenuItem(foundItem);
        } else {
          setError("Menu item not found");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">No item found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <Link href="/menu" className="text-blue-600 hover:underline text-lg">
          &larr; Back to Menu
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-800">Item Details</h1>
        <Link href="/cart" className="text-blue-600 hover:underline text-lg">
          View Cart
        </Link>
      </header>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex max-w-4xl w-full">
        <div className="md:w-1/2 relative h-80 md:h-auto">
          <Image
            src={menuItem.image}
            alt={menuItem.name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {menuItem.name}
            </h2>
            <p className="text-red-600 text-lg font-semibold mb-2">
              {menuItem.category}
            </p>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              {menuItem.description}
            </p>
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <span className="text-4xl font-extrabold text-red-700">
              €{menuItem.price.toFixed(2)}
            </span>
            <button
              onClick={() => addToCart(menuItem)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
