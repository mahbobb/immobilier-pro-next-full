"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export default function CategoryDrawer({
  open,
  onClose,
  onSelect,
}: Props) {
  if (!open) return null;

  const categories = [
    "Appartement",
    "Maison",
    "Villa",
    "Terrain",
    "Bureau",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-lg">
        <h2 className="font-bold mb-4">Sélectionner la catégorie</h2>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="block w-full text-left p-3 hover:bg-gray-100 rounded-lg"
          >
            {cat}
          </button>
        ))}

        <button onClick={onClose} className="mt-6 text-sm text-gray-500">
          Fermer
        </button>
      </div>
    </div>
  );
}
