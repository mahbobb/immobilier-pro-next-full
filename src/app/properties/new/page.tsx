"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */
type Agency = { id: string; name: string; city: string };

/* ================= VILLES & SECTEURS ================= */
const MOROCCO: Record<string, string[]> = {
  Casablanca: ["Maarif","Gauthier","Anfa","Ain Diab","Sidi Maarouf"],
  Rabat: ["Agdal","Hassan","Hay Riad","Souissi","Yacoub El Mansour"],
  Tanger: ["Malabata","Centre","Boubana","Iberia","Marshan"],
  Marrakech: ["Guéliz","Hivernage","Palmeraie"],
  Agadir: ["Founty","Talborjt","Anza"],
  Fès: ["Fès el Bali","Fès el Jdid","Saïss"],
  Meknès: ["Hamria","Marjane","Ville Nouvelle"],
};

export default function NewPropertyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ------- FORM STATE ------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"LOCATION"|"VENTE">("LOCATION");
  const [price, setPrice] = useState(0);
  const [surface, setSurface] = useState(50);
  const [rooms, setRooms] = useState(2);

  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [agencyId, setAgencyId] = useState("");

  const [images, setImages] = useState<FileList | null>(null);
  const [videos, setVideos] = useState<FileList | null>(null);

  /* ================= LOAD AGENCIES ================= */
  useEffect(() => {
    fetch("/api/agencies")
      .then(r => r.json())
      .then(d => setAgencies(d.agencies || []));
  }, []);

  /* ================= UPLOAD ================= */
  async function uploadOne(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || "Upload error");
    return data.url;
  }

  /* ================= SUBMIT ================= */
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      /* ---- Upload media first ---- */
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];

      if (images) {
        for (const f of Array.from(images).slice(0, 10)) {
          imageUrls.push(await uploadOne(f));
        }
      }

      if (videos) {
        for (const f of Array.from(videos).slice(0, 3)) {
          videoUrls.push(await uploadOne(f));
        }
      }

      /* ---- Send JSON (IMPORTANT) ---- */
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          price,
          surface,
          rooms,
          city,
          sector,
          address,
          agencyId,
          imageUrls,
          videoUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");

      window.location.href = "/properties";
    } catch (e: any) {
      setErr(e.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Créer un bien</h1>

      {err && <div className="mb-4 p-3 bg-red-50 text-red-700">{err}</div>}

      <form onSubmit={submit} className="space-y-4">

        <input className="w-full border p-2 rounded"
               placeholder="Titre"
               value={title}
               onChange={(e)=>setTitle(e.target.value)}
               required />

        <textarea className="w-full border p-2 rounded"
                  placeholder="Description"
                  rows={4}
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  required />

        <div className="grid grid-cols-2 gap-3">
          <select className="border p-2 rounded" value={type} onChange={(e)=>setType(e.target.value as any)}>
            <option value="LOCATION">Location</option>
            <option value="VENTE">Vente</option>
          </select>

          <input className="border p-2 rounded" type="number"
                 placeholder="Prix (MAD)"
                 value={price}
                 onChange={(e)=>setPrice(+e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" type="number"
                 placeholder="Surface (m²)"
                 value={surface}
                 onChange={(e)=>setSurface(+e.target.value)} />

          <input className="border p-2 rounded" type="number"
                 placeholder="Pièces"
                 value={rooms}
                 onChange={(e)=>setRooms(+e.target.value)} />
        </div>

        {/* VILLE / SECTEUR */}
        <div className="grid grid-cols-2 gap-3">
          <select className="border p-2 rounded"
                  value={city}
                  onChange={(e)=>{ setCity(e.target.value); setSector(""); }}
                  required>
            <option value="">-- Ville --</option>
            {Object.keys(MOROCCO).map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          {MOROCCO[city] && (
            <select className="border p-2 rounded"
                    value={sector}
                    onChange={(e)=>setSector(e.target.value)}>
              <option value="">-- Secteur --</option>
              {MOROCCO[city].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>

        <input className="w-full border p-2 rounded"
               placeholder="Adresse complète"
               value={address}
               onChange={(e)=>setAddress(e.target.value)}
               required />



        {/* MEDIA */}
        <input type="file" accept="image/*" multiple onChange={(e)=>setImages(e.target.files)} />
        <input type="file" accept="video/*" multiple onChange={(e)=>setVideos(e.target.files)} />

        <button disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60">
          {loading ? "Création..." : "Créer le bien"}
        </button>
      </form>
    </div>
  );
}

