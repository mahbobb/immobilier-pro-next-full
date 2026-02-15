"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, EyeOff } from "lucide-react";

export default function PasswordSettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    console.log("Password change request:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Tabs */}
      <div className="border-b bg-white px-8 py-4 flex gap-8 text-sm">
        <Link href="/fr/account/v2/my-ads" className="text-gray-600 hover:text-black">
          Mes annonces
        </Link>
        <Link href="/fr/account/v2/my-orders" className="text-gray-600 hover:text-black">
          Mes commandes
        </Link>
        <Link href="/fr/account/v2/my-favorites" className="text-gray-600 hover:text-black">
          Mes favoris
        </Link>
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
            className="flex justify-between items-center bg-white hover:bg-gray-100 px-4 py-3 rounded-md text-sm"
          >
            Modifier vos informations
            <ChevronRight size={16} />
          </Link>

          <Link
            href="/fr/account/v2/settings/password"
            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-md text-sm font-medium"
          >
            Modifier le mot de passe
            <ChevronRight size={16} />
          </Link>

          <Link
            href="/fr/account/v2/settings/notifications"
            className="flex justify-between items-center bg-white hover:bg-gray-100 px-4 py-3 rounded-md text-sm"
          >
            Paramètres de notification
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg p-8 shadow-sm border">

          <h2 className="text-lg font-semibold mb-6">
            Modifier le mot de passe
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe actuel
              </label>

              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow({ ...show, current: !show.current })
                  }
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nouveau mot de passe
              </label>

              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow({ ...show, new: !show.new })
                  }
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmer le mot de passe
              </label>

              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow({ ...show, confirm: !show.confirm })
                  }
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium"
              >
                Mettre à jour
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
