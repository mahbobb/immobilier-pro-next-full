"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ChevronRight } from "lucide-react";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    city: "",
    email: "",
    showPhone: false,
  });

  // Load user
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/account/profile");
      const data = await res.json();

      setForm({
        firstName: data.name || "",
        phone: data.phone || "",
        city: data.city || "",
        email: data.email || "",
        showPhone: false,
      });

      setLoading(false);
    }

    fetchUser();
  }, []);

  async function handleSave() {
    setSaving(true);

    await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    alert("Profil mis à jour ✅");
  }

  if (loading) return <div className="p-10">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Nav */}
      <div className="border-b bg-white px-8 py-4 flex gap-8 text-sm">
        <Link href="/fr/account/v2/my-ads">Mes annonces</Link>
        <Link href="/fr/account/v2/my-orders">Mes commandes</Link>
        <Link href="/fr/account/v2/my-favorites">Mes favoris</Link>
        <Link
          href="/fr/account/v2/settings/profile"
          className="text-blue-600 border-b-2 border-blue-600 pb-2"
        >
          Réglages
        </Link>
      </div>

      <div className="flex max-w-6xl mx-auto p-8 gap-8">

        {/* Sidebar */}
        <div className="w-64 space-y-2">
          <Link
            href="/fr/account/v2/settings/profile"
            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-md text-sm font-medium"
          >
            Modifier vos informations <ChevronRight size={16} />
          </Link>

          <Link
            href="/fr/account/v2/settings/password"
            className="flex justify-between items-center bg-white px-4 py-3 rounded-md text-sm"
          >
            Modifier le mot de passe <ChevronRight size={16} />
          </Link>

          <Link
            href="/fr/account/v2/settings/notification"
            className="flex justify-between items-center bg-white px-4 py-3 rounded-md text-sm"
          >
            Paramètres de notification <ChevronRight size={16} />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg p-8 shadow-sm border">

          <div className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                * Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="w-full border rounded-md pl-10 py-2"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                * Téléphone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-2">
                * Ville
              </label>
              <select
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
              >
                <option>Casablanca</option>
                <option>Rabat</option>
                <option>Marrakech</option>
                <option>Agadir</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                * Email
              </label>
              <input
                value={form.email}
                disabled
                className="w-full border rounded-md px-3 py-2 bg-gray-100"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-md"
            >
              {saving ? "Sauvegarde..." : "SAUVEGARDER"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
