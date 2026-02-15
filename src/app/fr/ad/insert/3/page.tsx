"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Star } from "lucide-react";

const MAX_IMAGES = 8;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function Step3Photos() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);

  /* =========================
     Charger si déjà présent
  ========================= */
  useEffect(() => {
    const stored = localStorage.getItem("ad-step3-files");
    if (stored) {
      // ⚠️ on ne peut pas recharger les File depuis localStorage
      // donc on ignore si refresh
    }
  }, []);
// récupérer les fichiers

  /* =========================
     Handle upload
  ========================= */
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= MAX_SIZE
    );

    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) return;

    setImages((prev) => [
      ...prev,
      ...validFiles.slice(0, remaining),
    ]);
  }

  /* =========================
     Remove image
  ========================= */
  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  /* =========================
     Set cover (index 0)
  ========================= */
  function moveToCover(index: number) {
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setImages(updated);
  }

  /* =========================
     Next step
  ========================= */
  function next() {
    if (images.length === 0) {
      alert("Ajoutez au moins une image");
      return;
    }

    // On sauvegarde les metadata seulement
    localStorage.setItem(
      "ad-step3",
      JSON.stringify({
        hasImages: true,
      })
    );

    // On garde les fichiers en mémoire globale
    // (solution temporaire avant envoi à Step4)
    // @ts-ignore
    window.adImages = images;

    router.push("/fr/ad/insert/4");
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h1 className="text-xl font-semibold mb-4">
            Photos de l'annonce
          </h1>

          {images.length < MAX_IMAGES ? (
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
              <span className="text-gray-500 text-sm">
                Glissez ou cliquez pour ajouter des images
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
              />
            </label>
          ) : (
            <div className="border border-red-200 bg-red-50 text-red-600 rounded-lg p-4 text-center text-sm">
              Limite de {MAX_IMAGES} images atteinte
            </div>
          )}

          {/* GRID */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-6">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover"
                  />

                  {/* Order badge */}
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                    {index + 1}
                  </div>

                  {/* Cover badge */}
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-yellow-400 text-white p-1 rounded-full">
                      <Star size={14} />
                    </div>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>

                  {/* Make cover */}
                  {index !== 0 && (
                    <button
                      onClick={() => moveToCover(index)}
                      className="absolute bottom-1 right-1 text-xs bg-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition"
                    >
                      Couverture
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 text-blue-700 p-3 mt-6 rounded text-sm">
            La première image sera la couverture
          </div>
        </div>

        {/* HELP BOX */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="font-semibold mb-3">
            Conseils photos
          </h2>
          <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
            Utilisez des images claires, lumineuses et de qualité.
          </div>
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end mt-10 max-w-4xl mx-auto">
        <button
          onClick={next}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          CONTINUER
        </button>
      </div>
    </div>
  );
}
