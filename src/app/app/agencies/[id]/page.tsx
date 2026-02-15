import Card from "@/components/Card"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export default async function AgencyShow(props: Props) {
  const { id } = await props.params

  const agency = await prisma.agency.findUnique({
    where: { id },
    include: {
      properties: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          city: true,
          price: true,
        },
      },
    },
  })

  if (!agency) notFound()

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-2">
        {agency.name}
      </h1>

      <p className="text-gray-600 mb-4">
        {agency.city} • {agency.phone}
      </p>

      {agency.address && (
        <p className="text-sm mb-4">{agency.address}</p>
      )}

      <h2 className="font-semibold mb-3">
        Biens ({agency.properties.length})
      </h2>

      {agency.properties.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {agency.properties.map((property) => (
            <li
              key={property.id}
              className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <div className="font-medium">{property.title}</div>
              <div className="text-xs text-gray-500">
                📍 {property.city} — 💰 {property.price}€
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          Aucun bien disponible pour cette agence.
        </p>
      )}
    </Card>
  )
}
