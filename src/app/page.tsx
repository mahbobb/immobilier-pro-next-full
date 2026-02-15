import Card from "@/components/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NewPropertiesSlider from "@/components/NewPropertiesSlider";

export default async function Home() {
const properties = await prisma.property.findMany({
  include: {
    images: true,
    user: true,   // 👈 si tu veux afficher le propriétaire
    videos: true
  },
  orderBy: {
    createdAt: "desc"
  }
});
    const props = await prisma.property.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { images: true },
  });
    const items = props.map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    type: p.type,
    price: p.price,
    imageUrl: p.images?.[0]?.url || null,
    badge: "NEUF",
  }));

  return (
     
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
      <NewPropertiesSlider items={items} />
    </div>
      
    </div>
  );
}
