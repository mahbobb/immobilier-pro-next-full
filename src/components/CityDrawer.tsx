"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (city: string, sector: string) => void;
};

export default function CityDrawer({
  open,
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  const cities = [
    { name: "Marrakech", sectors: ["Hivernage", "Guéliz", "Mhamid"] },
    { name: "Casablanca", sectors: ["Maarif", "Anfa", "Ain Diab"] },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-lg overflow-auto">
        <h2 className="font-bold mb-4">Ville - Secteur</h2>

        {cities.map((city) => (
          <div key={city.name} className="mb-4">
            <h3 className="font-semibold">{city.name}</h3>

            {city.sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => onSelect(city.name, sector)}
                className="block w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                {sector}
              </button>
            ))}
          </div>
        ))}

        <button onClick={onClose} className="mt-6 text-sm text-gray-500">
          Fermer
        </button>
      </div>
    </div>
  );
}
