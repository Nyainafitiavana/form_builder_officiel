import '@/styles/globals.css';
import 'antd/dist/reset.css';
import ThemeProvider from "@/components/ThemeProvider";
import React from "react";

export const metadata = {
  title: 'App with dynamic theme',
  description: 'Next.js + Ant Design + Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
    <body className="transition-colors duration-300">
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </body>
    </html>
  );
}
