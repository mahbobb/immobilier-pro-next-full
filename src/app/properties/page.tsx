import Card from "@/components/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PropertiesPage() {
  
  const properties = await prisma.property.findMany({
    include: {
      images: true,
      user: true,   // 👈 remplace agency
      videos: true, // optionnel si besoin
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Biens</h1>
        <Link className="px-3 py-2 bg-blue-600 text-white rounded-lg" href="/properties/new">+ Nouveau</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map(p => {
          const img = p.images[0]?.url;
          return (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
              <div className="h-40 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img || `https://placehold.co/600x400?text=${encodeURIComponent(p.title)}`} alt={p.title} className="h-40 w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-600">{p.type} • {p.city}</p>
                <p className="text-sm mt-1"><span className="font-semibold">{p.price.toLocaleString()}</span> MAD</p>
                <p className="text-xs text-gray-500 mt-1">Agence: {p.user?.name}</p>
                <Link href={`/properties/${p.id}`}>
  Voir le bien
</Link>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
