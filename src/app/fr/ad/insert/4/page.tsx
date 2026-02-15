"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const plans = [
  { id: "premium", name: "Annonce Premium", price: 149, badge: "🔥 POPULAIRE", features: ["En tête", "Badge Premium", "Priorité algo"] },
  { id: "boost", name: "Annonce Boostée", price: 79, features: ["7 jours en tête"] },
  { id: "urgent", name: "Annonce Urgente", price: 39, features: ["Badge Urgent"] },
  { id: "free", name: "Annonce Gratuite", price: 0, features: ["Publication simple"] },
];

export default function Step4Publish() {
  const router = useRouter();
  const [selected, setSelected] = useState("free");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);

    try {
      /* ==============================
         1️⃣ Récupérer localStorage
      ============================== */
      const step1 = JSON.parse(localStorage.getItem("ad-step1") || "{}");
      const step2 = JSON.parse(localStorage.getItem("ad-step2") || "{}");
      const step3 = JSON.parse(localStorage.getItem("ad-step3") || "{}");

      /* ==============================
         2️⃣ Construire FormData
      ============================== */
      const formData = new FormData();

      const finalData = {
        ...step1,
        ...step2,
        plan: selected,
        status: selected === "free" ? "PUBLISHED" : "DRAFT",
      };

      // Champs texte
      Object.entries(finalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Features (array)
      if (step3.features?.length) {
        step3.features.forEach((feature: string) => {
          formData.append("features", feature);
        });
      }

      // Images (File array)
      if (step3.images?.length) {
        step3.images.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      /* ==============================
         3️⃣ Envoi API
      ============================== */
      const res = await fetch("/api/ads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur création annonce");
        setLoading(false);
        return;
      }

      const adId = data.id;

      /* ==============================
         4️⃣ Plan gratuit
      ============================== */
      if (selected === "free") {
        localStorage.removeItem("ad-step1");
        localStorage.removeItem("ad-step2");
        localStorage.removeItem("ad-step3");

        router.push("/dashboard");
        return;
      }

      /* ==============================
         5️⃣ Plan payant
      ============================== */
      router.push(`/api/billing/checkout?plan=${selected}&adId=${adId}`);

    } catch (error) {
      console.error("ERREUR PUBLISH:", error);
      alert("Erreur serveur");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          Publier l'annonce
        </h1>

        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`relative border rounded-xl p-6 cursor-pointer transition
              ${selected === plan.id
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-400"}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {plan.name}
                  </h2>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xl font-bold">
                  {plan.price === 0 ? "Gratuit" : `${plan.price} MAD`}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-10">
          <button
            disabled={loading}
            onClick={handleContinue}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Publication..." : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
}
