"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Role = "CLIENT" | "AGENCE" | "PRESTATAIRE";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CLIENT");
  const [avatar, setAvatar] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setOk(null);
    setLoading(true);

    if (!name || !email || !phone || !password) {
      setError("Tous les champs sont obligatoires");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          password,
          role,
          avatar: avatar || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erreur lors de l’inscription");
        setLoading(false);
        return;
      }

      setOk("Compte créé avec succès ✅");

      setTimeout(() => {
        router.push(
          `/auth/verify-otp?phone=${encodeURIComponent(phone)}`
        );
      }, 800);
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de contacter le serveur, réessaie plus tard."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6">
                <div className="space-y-3 mb-6">
  <button
    type="button"
    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    className="w-full border rounded-lg py-2 hover:bg-gray-50"
  >
    🔵 Continuer avec Google
  </button>

  <button
    type="button"
    onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
    className="w-full border rounded-lg py-2 hover:bg-gray-50"
  >
    🟦 Continuer avec Facebook
  </button>
</div>


      <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
      <p className="text-sm text-gray-600 mb-6">
        Choisis ton rôle (client / agence / prestataire).
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {ok && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm">
          {ok}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg p-2"
          type="password"
          placeholder="Mot de passe"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full border rounded-lg p-2"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="CLIENT">Client</option>
          <option value="AGENCE">Agence</option>
          <option value="PRESTATAIRE">Prestataire</option>
        </select>

        <input
          className="w-full border rounded-lg p-2"
          placeholder="Avatar (URL optionnelle)"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer le compte"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Déjà un compte ?{" "}
        <Link className="text-blue-600 hover:underline" href="/login">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
