"use client";

import { useEffect, useState } from "react";

type Property = { id: string; title: string };
type Provider = { id: string; name: string; type: string };

export default function NewOrderPage() {
  const [properties,setProperties]=useState<Property[]>([]);
  const [providers,setProviders]=useState<Provider[]>([]);
  const [propertyId,setPropertyId]=useState("");
  const [providerId,setProviderId]=useState("");
  const [status,setStatus]=useState("EN_ATTENTE");
  const [message,setMessage]=useState("");
  const [err,setErr]=useState<string|null>(null);

  useEffect(()=>{
    fetch("/api/properties").then(r=>r.json()).then(d=>setProperties(d.properties || []));
    fetch("/api/service-providers").then(r=>r.json()).then(d=>setProviders(d.providers || []));
  },[]);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/orders",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ propertyId: propertyId || null, providerId: providerId || null, status, message }),
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){ setErr(data?.error || "Erreur"); return; }
    window.location.href="/orders";
  }

  return (
    <div className="max-w-xl bg-white border rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-4">Nouvelle commande</h1>
      {err && <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{err}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bien (optionnel)</label>
          <select className="w-full border rounded-lg p-2" value={propertyId} onChange={(e)=>setPropertyId(e.target.value)}>
            <option value="">—</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prestataire (optionnel)</label>
          <select className="w-full border rounded-lg p-2" value={providerId} onChange={(e)=>setProviderId(e.target.value)}>
            <option value="">—</option>
            {providers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select className="w-full border rounded-lg p-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMEE">Confirmée</option>
            <option value="TERMINEE">Terminée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="w-full border rounded-lg p-2" rows={4} value={message} onChange={(e)=>setMessage(e.target.value)} />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Créer</button>
        <p className="text-xs text-gray-500">Note: Une commande doit avoir au moins un bien OU un prestataire.</p>
      </form>
    </div>
  );
}
