import "./globals.css";
import Header from "./components/Header/Page";
import Footer from "./components/Footer/Page";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  icons: {
    icon: "/logo/Elenxia_Colored_NoTag.svg",
  },
  title: "Elenxia - Online Learning Platform",
  description: "Unlock your potential with our online courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
