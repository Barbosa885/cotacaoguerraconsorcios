import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

// Componentes
import { Providers } from "~/components/providers";
import { Navbar } from "~/components/Navbar";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "AvaliaCar - Consulta FIPE, Avaliação e Simulação",
  description: "Consulte a tabela FIPE, avalie seu veículo e simule financiamentos de forma rápida e inteligente. A melhor ferramenta para comprar e vender carros.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // or 'block', 'fallback', 'optional'
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable}`}>
      <body className="bg-gray-50">
        <Providers>
          <Toaster position="top-center" expand={false} richColors/>
          <Navbar />
          <TRPCReactProvider> 
            {children} 
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
