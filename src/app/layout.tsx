import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <Header />
         
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
