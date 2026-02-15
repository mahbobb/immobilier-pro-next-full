"use client";


import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdStatus } from "@prisma/client";
import { ShoppingCart, Heart, Settings } from "lucide-react";

interface Props {
  searchParams?: {
    status?: string;
  };
}

export default async function MyAdsPage({ searchParams }: Props) {
  const status = searchParams?.status ?? "PUBLISHED";

  const ads = await prisma.ad.findMany({
    where: {
      status: status as AdStatus,
    },
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-8 text-sm font-medium text-gray-600">
          <Link href="?status=PUBLISHED" className="text-blue-600 border-b-2 border-blue-600 pb-2">
            Mes annonces
          </Link>
          <span className="flex items-center gap-2 cursor-pointer">
            <ShoppingCart size={16} /> Mes commandes
          </span>
          <span className="flex items-center gap-2 cursor-pointer">
            <Heart size={16} /> Mes favoris
          </span>
          <span className="flex items-center gap-2 cursor-pointer">
            <Settings size={16} /> Réglages
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">

        {/* FILTER TABS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: "Actives", value: "PUBLISHED" },
            { label: "Brouillons", value: "DRAFT" },
            { label: "Expirées", value: "EXPIRED" },
            { label: "Vendues", value: "SOLD" },
          ].map((tab) => (
            <Link
              key={tab.value}
              href={`?status=${tab.value}`}
              className={`px-4 py-2 rounded-full text-sm transition ${
                status === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* ADS LIST */}
        {ads.length > 0 ? (
          <div className="space-y-6">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6"
              >
                {/* Image */}
                <img
                  src={ad.images[0]?.url || "/placeholder.jpg"}
                  alt=""
                  className="w-40 h-28 object-cover rounded-lg"
                />

                {/* Infos */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {ad.category}
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {ad.status}
                    </span>
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">
                    {ad.description}
                  </p>

                  <div className="text-xs text-gray-500 mt-2">
                    📍 {ad.city}
                  </div>

                  <div className="mt-4 bg-gray-100 text-sm rounded-lg px-4 py-2 w-fit text-gray-600">
                    Pack : {ad.plan}
                  </div>
                </div>

                {/* Boost button */}
                <div className="flex items-center">
                  <Link
                    href={`/api/billing/checkout?plan=${ad.plan}&adId=${ad.id}`}
                    className="border border-orange-400 text-orange-500 px-6 py-2 rounded-lg hover:bg-orange-50 transition font-medium"
                  >
                    🚀 BOOSTER
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-xl text-center text-gray-500">
            Vous n'avez pas encore publié d'annonces.
            <div className="mt-4">
              <Link
                href="/fr/ad/insert/1"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Publier une annonce
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
