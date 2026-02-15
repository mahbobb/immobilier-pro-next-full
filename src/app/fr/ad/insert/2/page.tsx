"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InsertAdStepTwo() {
  const router = useRouter();

  const [furnished, setFurnished] = useState(false);
  const [rooms, setRooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const featureList = [
    "Balcon",
    "Terrasse",
    "Garage",
    "Parking",
    "Ascenseur",
    "Sécurité",
    "Piscine",
    "Climatisation",
    "Chauffage",
  ];

  /* ===============================
     Toggle Feature
  =============================== */
  const toggleFeature = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  /* ===============================
     Next Step
  =============================== */
  function next() {
    const stepData = {
      rooms,
      bathrooms,
      surface: Number(area),
      price: Number(price),
      furnished,
      description,
      features,
    };

    // Sauvegarde temporaire en localStorage
    localStorage.setItem("ad-step2", JSON.stringify(stepData));

    router.push("/fr/ad/insert/3");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-6">
          Détails de l'annonce
        </h1>

        {/* Rooms */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-2">
              Chambres
            </label>
            <input
              type="number"
              value={rooms}
              onChange={(e) =>
                setRooms(Number(e.target.value))
              }
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Salles de bain
            </label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) =>
                setBathrooms(Number(e.target.value))
              }
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Surface */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Surface (m²)
          </label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Prix (DH)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Furnished */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Meublé
          </label>
          <button
            type="button"
            onClick={() => setFurnished(!furnished)}
            className={`px-4 py-2 rounded-lg border transition ${
              furnished
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {furnished ? "Oui" : "Non"}
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Features */}
        <div className="mb-6">
          <label className="block font-medium mb-3">
            Plus de détails
          </label>

          <div className="flex flex-wrap gap-2">
            {featureList.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  features.includes(feature)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          CONTINUER
        </button>
      </div>
    </div>
  );
}
