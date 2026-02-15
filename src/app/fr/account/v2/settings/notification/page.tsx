"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    accountEmails: true,
    adsEmails: true,
    packEmails: false,
    paymentEmails: true,
    newsletter: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navigation */}
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
            className="flex justify-between items-center bg-white hover:bg-gray-100 px-4 py-3 rounded-md text-sm"
          >
            Modifier le mot de passe
            <ChevronRight size={16} />
          </Link>

          <Link
            href="/fr/account/v2/settings/notification"
            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-md text-sm font-medium"
          >
            Paramètres de notification
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg p-8 shadow-sm border">

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-8 text-sm">
            <p className="font-medium mb-1">Paramétrage de notification par email</p>
            <p>
              Les notifications par Email vous permettent d'être tenu informé,
              vous pouvez activer ou désactiver le type d'email que vous voulez recevoir.
            </p>
          </div>

          {/* Settings List */}
          <div className="space-y-8">

            <NotificationItem
              label="Emails de Gestion de compte"
              description="Email relatif à votre compte comme la récupération de mot de passe."
              value={settings.accountEmails}
              onToggle={() => toggle("accountEmails")}
            />

            <NotificationItem
              label="Emails des Annonces"
              description="Email envoyé à chaque changement de status de vos annonces."
              value={settings.adsEmails}
              onToggle={() => toggle("adsEmails")}
            />

            <NotificationItem
              label="Emails des Packs"
              description="Email envoyé à l'application de chaque pack."
              value={settings.packEmails}
              onToggle={() => toggle("packEmails")}
            />

            <NotificationItem
              label="Emails des Payments"
              description="Email envoyé à chaque paiement effectué."
              value={settings.paymentEmails}
              onToggle={() => toggle("paymentEmails")}
            />

            <NotificationItem
              label="Newsletters"
              description="Email relatif aux offres et promotions et aussi aux actualités."
              value={settings.newsletter}
              onToggle={() => toggle("newsletter")}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function NotificationItem({ label, description, value, onToggle }: Props) {
  return (
    <div className="flex justify-between items-start gap-6">

      <div>
        <h3 className="font-medium text-sm">{label}</h3>
        <p className="text-gray-500 text-xs mt-1">{description}</p>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
            value ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
