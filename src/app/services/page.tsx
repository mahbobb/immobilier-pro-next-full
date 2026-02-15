import Card from "@/components/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const providers = await prisma.serviceProvider.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Prestataires</h1>
        <Link className="px-3 py-2 bg-blue-600 text-white rounded-lg" href="/services/new">+ Nouveau</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(p => (
          <div key={p.id} className="border rounded-lg p-4">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-600">{p.type} • {p.city}</p>
            <p className="text-sm">{p.phone}</p>
            {p.description && <p className="text-sm text-gray-600 mt-2">{p.description}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
}
