"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategoryDrawer from "@/components/CategoryDrawer";
import CityDrawer from "@/components/CityDrawer";

export default function Step1() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [openCategory, setOpenCategory] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  function next() {
    if (!category || !city) {
      alert("Veuillez sélectionner la catégorie et la ville.");
      return;
    }

    localStorage.setItem(
      "ad-step1",
      JSON.stringify({
        category,
        city,
        sector,
        address,
        phone,
      })
    );

    router.push("/fr/ad/insert/2");
  }

  return (
    <>
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
          <h1 className="text-xl font-bold mb-6">
            Qu'annoncez-vous aujourd’hui ?
          </h1>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Catégorie</label>

            <button
              onClick={() => setOpenCategory(true)}
              className="w-full border rounded-lg p-3 text-left hover:border-blue-500"
            >
              {category || "Sélectionner une catégorie"}
            </button>
          </div>

          {/* ADDRESS */}
          <h2 className="font-semibold mt-6 mb-3">Votre Adresse</h2>

          <div className="mb-4">
            <label className="block font-medium mb-2">
              Ville - Secteur
            </label>

            <button
              onClick={() => setOpenCity(true)}
              className="w-full border rounded-lg p-3 text-left hover:border-blue-500"
            >
              {city
                ? `${city}${sector ? " - " + sector : ""}`
                : "Sélectionner"}
            </button>
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">
              Adresse du bien
            </label>

            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              placeholder="Adresse du bien"
            />
          </div>

          {/* PHONE */}
          <h2 className="font-semibold mt-6 mb-3">Vos coordonnées</h2>

          <div className="mb-6">
            <label className="block font-medium mb-2">
              Numéro de téléphone
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              placeholder="06XXXXXXXX"
            />
          </div>

          <button
            onClick={next}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
          >
            CONTINUER
          </button>
        </div>
      </div>

      {/* DRAWERS */}
      <CategoryDrawer
        open={openCategory}
        onClose={() => setOpenCategory(false)}
        onSelect={(value: string) => {
          setCategory(value);
          setOpenCategory(false);
        }}
      />

      <CityDrawer
        open={openCity}
        onClose={() => setOpenCity(false)}
        onSelect={(selectedCity: string, selectedSector: string) => {
          setCity(selectedCity);
          setSector(selectedSector);
          setOpenCity(false);
        }}
      />
    </>
  );
}
