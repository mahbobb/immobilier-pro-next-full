import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex flex-wrap gap-3 text-sm">
      <Link className="hover:underline" href="/">Accueil</Link>
      <Link className="hover:underline" href="/properties">Biens</Link>
      <Link className="hover:underline" href="/services">Prestataires</Link>
      <Link className="hover:underline" href="/agencies">Agences</Link>
      <Link className="hover:underline" href="/orders">Commandes</Link>
      <Link className="hover:underline" href="/dashboard">Dashboard</Link>
    </nav>
  );
}
