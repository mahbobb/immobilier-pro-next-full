"use client";

import { useState } from "react";

export default function NewAgencyPage() {
  const [name,setName] = useState("");
  const [city,setCity] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");
  const [userEmail,setUserEmail] = useState(""); // attach to user by email (simple)
  const [msg,setMsg] = useState<string|null>(null);
  const [err,setErr] = useState<string|null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);

    const res = await fetch("/api/agencies", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, city, phone, address, userEmail }),
    });
    const data = await res.json().catch(()=>({}));

    if (!res.ok) { setErr(data?.error || "Erreur"); return; }
    setMsg("Agence créée ✅");
    window.location.href = "/agencies";
  }

  return (
    <div className="max-w-xl bg-white border rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Nouvelle agence</h1>
      {err && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{err}</div>}
      {msg && <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm">{msg}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input className="w-full border rounded-lg p-2" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <input className="w-full border rounded-lg p-2" value={city} onChange={(e)=>setCity(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input className="w-full border rounded-lg p-2" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input className="w-full border rounded-lg p-2" value={address} onChange={(e)=>setAddress(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email du compte agence (doit exister)</label>
          <input className="w-full border rounded-lg p-2" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} placeholder="agence@demo.com" required />
          <p className="text-xs text-gray-500 mt-1">Astuce: crée d’abord un compte rôle AGENCE dans /register.</p>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Créer</button>
      </form>
    </div>
  );
}
