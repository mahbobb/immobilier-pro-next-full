"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user as any;

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-blue-600">
              Abra<span className="text-gray-900">Jeimmo</span>
            </span>
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600">Accueil</Link>
            <Link href="/properties" className="hover:text-blue-600">Biens</Link>
            <Link href="/agencies" className="hover:text-blue-600">Agences</Link>
            <Link href="/services" className="hover:text-blue-600">Prestataires</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>

          {/* RIGHT DESKTOP */}
          <div className="hidden md:flex items-center gap-4 relative">

            {/* ===== LOGGED USER ===== */}
            {status === "authenticated" ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
              >
                {/* AVATAR */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}`
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />

                {/* NAME */}
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-gray-50"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Inscription
                </Link>
              </>
            )}

            {/* PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white border rounded-xl shadow-lg overflow-hidden">
                <Link
                  href="/fr/account/v2/my-ads"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  👤 Mon profil
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* BURGER MOBILE */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">

            <Link href="/" onClick={() => setOpen(false)}>Accueil</Link>
            <Link href="/properties" onClick={() => setOpen(false)}>Biens</Link>
            <Link href="/agencies" onClick={() => setOpen(false)}>Agences</Link>
            <Link href="/services" onClick={() => setOpen(false)}>Prestataires</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>

            <div className="pt-4 border-t space-y-2">

              {status === "authenticated" ? (
                <>
                  <div className="flex items-center gap-3 px-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User"
                        )}`
                      }
                      className="w-9 h-9 rounded-full border"
                    />
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <Link href="/fr/account/v2/my-ads" onClick={() => setOpen(false)}>
                    📊 Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    👤 Mon profil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-red-600"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                    onClick={() => setOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
