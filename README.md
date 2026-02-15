# Immobilier Pro Next (COMPLET)

✅ Next.js 14 + App Router + Tailwind  
✅ Prisma (SQLite par défaut)  
✅ Auth (NextAuth Credentials) + Register  
✅ Rôles (ADMIN/AGENCE/PRESTATAIRE/CLIENT)  
✅ CRUD basique: Agences, Prestataires, Biens, Commandes  
✅ Upload images local (dev)

## 1) Installation
```bash
npm install
```

## 2) Config
Copie `.env.example` -> `.env`
```bash
copy .env.example .env
```

## 3) DB + seed (comptes démo)
```bash
npx prisma migrate dev
npm run seed
```

## 4) Démarrer
```bash
npm run dev
```

Ouvre http://localhost:3000

## Comptes démo
- admin@demo.com / Admin12345
- agence@demo.com / Agence12345
- prestataire@demo.com / Prest12345
- client@demo.com / Client12345

## Notes
- Upload local écrit dans `public/uploads` (OK en local).
- Pour déployer (Vercel), utilise Cloudinary/S3 (on peut l’ajouter).
