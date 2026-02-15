"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyOtpClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const phone = searchParams.get("phone");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleVerify() {
    if (!code) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Code invalide");
        return;
      }

      // ✅ Redirection après succès
      router.push("/");
    } catch (err) {
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow">
      <h1 className="text-xl font-bold mb-2">Vérification OTP</h1>

      <p className="text-sm text-gray-600 mb-4">
        Code envoyé au : <strong>{phone}</strong>
      </p>

      <input
        className="w-full border rounded-lg p-2 mb-3"
        placeholder="Code OTP"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
      >
        {loading ? "Vérification..." : "Vérifier"}
      </button>
    </div>
  );
}
