"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      setLoading(false);

      if (!res) {
        setError("Erreur serveur. Réessayez.");
        return;
      }

      if (res.error) {
        switch (res.error) {
          case "CredentialsSignin":
            setError("Identifiant ou mot de passe incorrect.");
            break;
          case "AccessDenied":
            setError("Accès refusé.");
            break;
          default:
            setError("Une erreur est survenue.");
        }
        return;
      }

      // ✅ Succès
      router.push("/dashboard");

    } catch (err) {
      setLoading(false);
      setError("Impossible de se connecter.");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 shadow">
      <h1 className="text-2xl font-bold mb-2">Connexion</h1>
      <p className="text-sm text-gray-600 mb-6">
        Connecte-toi avec ton email ou numéro de téléphone.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Email ou Téléphone
          </label>
          <input
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            type="text"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Pas de compte ?{" "}
        <Link
          className="text-blue-600 hover:underline"
          href="/register"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
