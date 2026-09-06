import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimationProvider } from "@/components/AnimationProvider";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap"
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap"
});
export const metadata = {
  title: "Money Matters",
  description: "Premium financial literacy web app for youth. Interactive modules, AI financial mentor, and gamified simulations. Learn, save, and grow your wealth!",
  keywords: ["financial literacy", "youth", "SIP", "budgeting", "investing", "finance education", "money management"],
  authors: [{
    name: "Money Matters"
  }],
  icons: {
    icon: "/logo.ico",
    apple: "/logo.png"
  }
};
export const viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({
  children
}) {
  return /*#__PURE__*/_jsx("html", {
    lang: "en",
    className: "light",
    suppressHydrationWarning: true,
    children: /*#__PURE__*/_jsx("body", {
      className: `${inter.variable} ${spaceGrotesk.variable} antialiased min-h-screen font-sans`,
      children: /*#__PURE__*/_jsxs(ThemeProvider, {
        attribute: "class",
        defaultTheme: "light",
        enableSystem: false,
        children: [
          /*#__PURE__*/_jsx(ClientProviders, {
            children: /*#__PURE__*/_jsx(AnimationProvider, {
              children: children
            })
          })
        ]
      })
    })
  });
}