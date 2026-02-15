"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";

type Item = {
  id: string;
  title: string;
  city: string;
  type: string;
  price: number;
  imageUrl?: string | null;
  badge?: string; // ex: "NEUF"
};

export default function NewPropertiesSlider({
  title = "🔥 Pop • Biens neufs",
  moreHref = "/properties",
  items,
}: {
  title?: string;
  moreHref?: string;
  items: Item[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => items ?? [], [items]);

  function scrollBy(px: number) {
    scrollerRef.current?.scrollBy({ left: px, behavior: "smooth" });
  }

  return (
    <section className="mt-10">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">{title}</h2>

        <div className="flex items-center gap-3">
          <Link href={moreHref} className="text-sm text-blue-600 hover:underline">
            Plus d’annonces
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-520)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              aria-label="Précédent"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollBy(520)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              aria-label="Suivant"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* SLIDER */}
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {list.length === 0 ? (
          <div className="w-full bg-white border rounded-xl p-6 text-gray-600">
            Aucun bien neuf pour le moment.
          </div>
        ) : (
          list.map((p) => {
            const img =
              p.imageUrl ||
              `https://placehold.co/600x400?text=${encodeURIComponent(p.title)}`;

            return (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="min-w-[280px] max-w-[280px] bg-white border rounded-xl overflow-hidden hover:shadow-md transition"
              >
                {/* IMAGE */}
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                  />

                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                    {p.badge || "NEUF"}
                  </span>

                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {p.type}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-1">
                  <p className="font-semibold line-clamp-2">{p.title}</p>
                  <p className="text-sm text-gray-600">{p.city}</p>

                  <p className="text-blue-600 font-bold text-lg">
                    {p.price.toLocaleString()} MAD
                  </p>

                  <p className="text-xs text-gray-500">Voir →</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
