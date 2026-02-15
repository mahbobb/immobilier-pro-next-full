import { prisma } from "@/lib/prisma";
import Link from "next/link";
import VideoCover from "@/components/VideoCover";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyShowPage({ params }: Props) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: true,
      videos: true,
      agency: true,
    },
  });

  if (!property) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        Bien introuvable
      </div>
    );
  }

  const mainVideo = property.videos.find(v => v.isMain);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <Link href="/properties" className="text-blue-600 hover:underline">
          ← Retour
        </Link>
      </div>

      {/* MEDIA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

        {/* IMAGES */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {property.images.length ? (
            property.images.map(img => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url}
                alt={property.title}
                className="h-64 w-full object-cover rounded-xl border"
              />
            ))
          ) : (
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              Aucune image
            </div>
          )}
        </div>

        {/* VIDEO WITH COVER */}
        <VideoCover
          videoUrl={mainVideo?.url}
          posterUrl={property.images[0]?.url}
        />
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {/* INFOS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Info label="Type" value={property.type} />
            <Info label="Prix" value={`${property.price.toLocaleString()} MAD`} />
            <Info label="Surface" value={`${property.surface} m²`} />
            <Info label="Pièces" value={String(property.rooms)} />
            <Info label="Ville" value={property.city} />
            <Info label="Secteur" value={property.sector || "—"} />
          </div>

          {/* ADDRESS */}
          <div>
            <h2 className="text-lg font-semibold">Adresse</h2>
            <p className="text-gray-600">{property.address}</p>
          </div>
        </div>

        {/* AGENCY */}
        <aside className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <p className="text-sm text-gray-500">Agence</p>
          <p className="text-lg font-semibold">{property.agency?.name}</p>
          <p className="text-sm text-gray-600">📍 {property.agency?.city}</p>

          <div className="pt-4 border-t space-y-2">
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Contacter l’agence
            </button>
            <Link
              href={`/orders/new?property=${property.id}`}
              className="block text-center py-3 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Demander un service
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
