import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panel de Triggers — Equals11",
  description: "Corré los workflows de n8n de Equals11 sin entrar a la UI de n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `geistSans.variable` NO es opcional: define --font-geist-sans, que globals.css mapea a
  // --font-sans. Sin esta clase, `font-sans` cae al fallback del sistema sin error de build
  // ni warning en consola — solo tipografía distinta que puede pasar desapercibida.
  return (
    <html lang="es" className={geistSans.variable}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
