"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem, useCart } from "@/app/store/useCart";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchMenu() {
      const response = await fetch("/api/menu");
      const data: MenuItem[] = await response.json();
      setMenuItems(data);
      setFilteredItems(data);
    }
    fetchMenu();
  }, []);

  useEffect(() => {
    let items = menuItems;

    // Filter by category
    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query (name, category, price)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.category.toLowerCase().includes(lowerCaseQuery) ||
          item.price.toString().includes(lowerCaseQuery),
      );
    }

    setFilteredItems(items);
  }, [searchQuery, selectedCategory, menuItems]);

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Our Menu</h1>
        <Link href="/cart" className="text-blue-600 hover:underline text-lg">
          View Cart
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Category Filter */}
        <div className="md:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap md:flex-col gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-lg transition duration-300 ${
                  selectedCategory === category
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items and Search */}
        <div className="md:w-3/4">
          <input
            type="text"
            placeholder="Search by name, category, or price..."
            className="w-full p-3 rounded-lg shadow-md mb-6 border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <Link
                  href={`/menu/${item.id}`}
                  className="block relative h-48 w-full"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex-grow">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
                    <span className="text-2xl font-bold text-red-600">
                      €{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <p className="text-center text-gray-600 text-xl mt-10">
              No items found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
