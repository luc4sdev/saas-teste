import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400', '500', '800']
})
export const metadata: Metadata = {
  title: "ClickFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body
        className={`${redHatDisplay.className} antialiased`}
      >
        {children}
        <ToastContainer stacked />
      </body>
    </html>
  );
}
