"use client";

import { usePathname } from "next/navigation";
import { Inter, Merriweather, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "../components/providers/ConvexClientProvider";
import Navbar from "../components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNavbar = !pathname?.startsWith("/dashboard");

  return (
    <body className={`${inter.variable} ${merriweather.variable} ${geistMono.variable} antialiased`}>
      <ConvexClientProvider>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
        {showNavbar && <Navbar />}
        {children}
        <Toaster />
      </ConvexClientProvider>
    </body>
  );
}
