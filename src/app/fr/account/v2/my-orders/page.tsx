"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function MyOrdersPage() {
  const orders: any[] = []; // remplacer plus tard par data MySQL

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-8 text-sm font-medium text-gray-600">
          <Link href="/fr/account/v2/my-ads" className="hover:text-black">
            Mes annonces
          </Link>

          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 flex items-center gap-2">
            <ShoppingCart size={16} />
            Mes commandes
          </button>

          <Link href="/fr/account/v2/my-favorites" className="hover:text-black">
            Mes favoris
          </Link>

          <Link href="/fr/account/v2/settings" className="hover:text-black">
            Réglages
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto flex">

        {/* Sidebar Filters */}
        <div className="w-64 bg-white border-r p-6 text-sm text-gray-600 hidden md:block">
          <h2 className="font-semibold mb-4">Statuts des commandes</h2>

          <ul className="space-y-3">
            <li className="hover:text-black cursor-pointer">
              Commandes initiées
            </li>
            <li className="hover:text-black cursor-pointer">
              Commandes en cours de préparation
            </li>
            <li className="hover:text-black cursor-pointer">
              Commandes en livraison
            </li>
            <li className="hover:text-black cursor-pointer">
              Commandes livrées
            </li>
            <li className="hover:text-black cursor-pointer">
              Commandes annulées
            </li>
          </ul>
        </div>

        {/* Main Section */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">

          {orders.length === 0 && (
            <>
              {/* Circle Icon */}
              <div className="w-52 h-52 bg-blue-100 rounded-full flex items-center justify-center mb-8 relative">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
                  ✖
                </div>
              </div>

              {/* Text */}
              <h2 className="text-blue-600 text-lg font-medium mb-2">
                Vous n'avez pas encore passé une commande
              </h2>

              <p className="text-gray-500 text-sm max-w-md mb-6">
                Commencez par trouver l'article qui correspond à vos besoins
                sur nos boutiques en ligne, et passez au paiement instantané.
              </p>

              {/* Button */}
              <Link
                href="/boutiques"
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
              >
                Découvrez maintenant
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
