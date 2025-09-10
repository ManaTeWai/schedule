import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Расписание СтИК",
  description: "Расписание ставропольского института кооперации",
};

import { Header, Footer } from "@/components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
