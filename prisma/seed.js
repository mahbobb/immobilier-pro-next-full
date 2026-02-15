const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

  // =====================
  // ADMIN
  // =====================
  const adminEmail = "admin@demo.com";
  const adminPass = "Admin12345";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPass, 10),
      role: "ADMIN",
      phone: "0600000001",
      avatar: "https://ui-avatars.com/api/?name=Admin",
    },
  });

  console.log("✅ Admin :", adminEmail, adminPass);

  // =====================
  // AGENCE
  // =====================
  const agencyUser = await prisma.user.upsert({
    where: { email: "agence@demo.com" },
    update: {},
    create: {
      name: "Agence Demo",
      email: "agence@demo.com",
      password: await bcrypt.hash("Agence12345", 10),
      role: "AGENCE",
      phone: "0600000002",
      avatar: "https://ui-avatars.com/api/?name=Agence+Demo",
    },
  });

  await prisma.agency.upsert({
    where: { userId: agencyUser.id },
    update: {},
    create: {
      name: "Agence Atlas",
      city: "Casablanca",
      phone: "0600000000",
      address: "Centre Ville",
      userId: agencyUser.id,
    },
  });

  // =====================
  // PRESTATAIRE
  // =====================
  const spUser = await prisma.user.upsert({
    where: { email: "prestataire@demo.com" },
    update: {},
    create: {
      name: "Prestataire Demo",
      email: "prestataire@demo.com",
      password: await bcrypt.hash("Prest12345", 10),
      role: "PRESTATAIRE",
      phone: "0600000003",
      avatar: "https://ui-avatars.com/api/?name=Prestataire+Demo",
    },
  });

  await prisma.serviceProvider.upsert({
    where: { userId: spUser.id },
    update: {},
    create: {
      name: "Electricien Pro",
      type: "ELECTRICITE",
      phone: "0611111111",
      city: "Rabat",
      description: "Interventions rapides",
      userId: spUser.id,
    },
  });

  // =====================
  // CLIENT
  // =====================
  await prisma.user.upsert({
    where: { email: "client@demo.com" },
    update: {},
    create: {
      name: "Client Demo",
      email: "client@demo.com",
      password: await bcrypt.hash("Client12345", 10),
      role: "CLIENT",
      phone: "0600000004",
      avatar: "https://ui-avatars.com/api/?name=Client+Demo",
    },
  });

  console.log("✅ Comptes demo créés avec phone + avatar");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
