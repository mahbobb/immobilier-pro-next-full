import Card from "@/components/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AgenciesPage() {
  const agencies = await prisma.agency.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Agences</h1>
        <Link className="px-3 py-2 bg-blue-600 text-white rounded-lg" href="/agencies/new">+ Nouvelle</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2">Nom</th>
              <th>Ville</th>
              <th>Téléphone</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map(a => (
              <tr key={a.id} className="border-t">
                <td className="py-2">{a.name}</td>
                <td>{a.city}</td>
                <td>{a.phone}</td>
                <td className="text-right">
                  <Link className="text-blue-600 hover:underline" href={`/agencies/${a.id}`}>Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
