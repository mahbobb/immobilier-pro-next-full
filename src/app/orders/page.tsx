import Card from "@/components/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Commandes</h1>
        <Link className="px-3 py-2 bg-blue-600 text-white rounded-lg" href="/orders/new">+ Nouvelle</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2">ID</th>
              <th>Statut</th>
              <th>Bien</th>
              <th>Prestataire</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="py-2">{o.id.slice(0,8)}…</td>
                <td>{o.status}</td>
                <td>{o.propertyId ? o.propertyId.slice(0,8) + "…" : "—"}</td>
                <td>{o.providerId ? o.providerId.slice(0,8) + "…" : "—"}</td>
                <td className="max-w-xs truncate">{o.message || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
