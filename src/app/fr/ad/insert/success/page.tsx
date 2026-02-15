"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdSuccessPage() {
  const [username, setUsername] = useState("Utilisateur");

  useEffect(() => {
    // Si tu veux récupérer le nom depuis localStorage
    const name = localStorage.getItem("user-name");
    if (name) setUsername(name);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-10 text-center">

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          🎉 Félicitations {username}
        </h1>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <CheckCircle size={50} className="text-blue-600" />
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-3">
          Votre annonce sera vérifiée par notre équipe.
        </p>

        <p className="text-gray-700 mb-4">
          Nous venons de vous envoyer un mail de confirmation.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Votre annonce sera active dans quelques instants.
        </p>

        {/* Button */}
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          MES ANNONCES
        </Link>

      </div>
    </div>
  );
}
