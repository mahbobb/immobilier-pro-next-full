"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";

export default function MyFavoritesPage() {
  const [activeTab, setActiveTab] = useState("ads");
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50">

      {/* Tabs */}
      <div className="border-b bg-white px-8 py-4 flex gap-8 text-sm">
        <Link href="/fr/account/v2/my-ads" className="text-gray-600 hover:text-black">
          Mes annonces
        </Link>

        <Link href="/fr/account/v2/my-orders" className="text-gray-600 hover:text-black">
          Mes commandes
        </Link>

        <Link
          href="/fr/account/v2/my-favorites"
          className="text-blue-600 border-b-2 border-blue-600 pb-2"
        >
          Mes favoris
        </Link>

        <Link href="/fr/account/v2/settings" className="text-gray-600 hover:text-black">
          Réglages
        </Link>
      </div>

      <div className="p-8">

        {/* Dropdown */}
        <div className="relative w-60 mb-16">
          <button
            onClick={() => setOpen(!open)}
            className="w-full bg-white border rounded-md px-4 py-2 text-left flex justify-between items-center shadow-sm"
          >
            <span>
              {activeTab === "ads"
                ? "Annonces sauvegardées"
                : "Recherches sauvegardées"}
            </span>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg overflow-hidden z-10">
              <button
                onClick={() => {
                  setActiveTab("ads");
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-100 ${
                  activeTab === "ads" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Annonces sauvegardées
              </button>

              <button
                onClick={() => {
                  setActiveTab("searches");
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-100 ${
                  activeTab === "searches" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Recherches sauvegardées
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <Heart size={48} className="text-blue-500" />
          </div>

          <h2 className="text-gray-600 text-lg">
            {activeTab === "ads"
              ? "Vous n'avez aucune annonce sauvegardée"
              : "Vous n'avez aucune recherche sauvegardée"}
          </h2>

          <Link
            href="/fr/post-ad"
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition"
          >
            Publier une annonce
          </Link>
        </div>
      </div>
    </div>
  );
}
