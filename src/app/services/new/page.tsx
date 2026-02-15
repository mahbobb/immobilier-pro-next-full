"use client";

import { useState } from "react";

export default function NewServiceProvider() {
  const [name,setName]=useState("");
  const [type,setType]=useState("ELECTRICITE");
  const [phone,setPhone]=useState("");
  const [city,setCity]=useState("");
  const [description,setDescription]=useState("");
  const [userEmail,setUserEmail]=useState("");
  const [err,setErr]=useState<string|null>(null);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/service-providers",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ name, type, phone, city, description, userEmail }),
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){ setErr(data?.error || "Erreur"); return; }
    window.location.href="/services";
  }

  return (
    <div className="max-w-xl bg-white border rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Nouveau prestataire</h1>
      {err && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{err}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input className="w-full border rounded-lg p-2" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full border rounded-lg p-2" value={type} onChange={(e)=>setType(e.target.value)}>
              <option value="ELECTRICITE">Électricité</option>
              <option value="PLOMBERIE">Plomberie</option>
              <option value="MENAGE">Ménage</option>
              <option value="PEINTURE">Peinture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input className="w-full border rounded-lg p-2" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ville</label>
          <input className="w-full border rounded-lg p-2" value={city} onChange={(e)=>setCity(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border rounded-lg p-2" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email du compte prestataire (doit exister)</label>
          <input className="w-full border rounded-lg p-2" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} placeholder="prestataire@demo.com" required />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Créer</button>
      </form>
    </div>
  );
}
