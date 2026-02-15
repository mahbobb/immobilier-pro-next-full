import Card from "@/components/Card"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Role } from "@prisma/client"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const role = session.user.role

  const isAdmin = role === Role.ADMIN
  const isAgent = role === Role.AGENCE

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>

      <p className="text-gray-600 mb-6">
        Connecté en tant que{" "}
        <span className="font-semibold">{role}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Link className="border rounded-lg p-4" href="/properties">
          🏠 Biens
        </Link>

        {(isAdmin || isAgent) && (
          <Link className="border rounded-lg p-4" href="/agencies">
            🏢 Agences
          </Link>
        )}

        {isAdmin && (
          <Link className="border rounded-lg p-4" href="/services">
            👷 Prestataires
          </Link>
        )}

        <Link className="border rounded-lg p-4" href="/orders">
          🛒 Commandes
        </Link>
      </div>
    </Card>
  )
}
