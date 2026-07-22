import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundGrid from "@/components/BackgroundGrid";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MCA Grievance-Portal",
  description: "MCA Grievance-Portal is a central system for all of the college related and hostel related complaints where studetns can signup/login and file their complaints and the resolvers can see the complaint change their status as they are proceeding in resolving the complaint.",
  viewport: 'width=device-width, initial-scale=1',
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundGrid />
        {children}
      </body>
    </html>
  );
}
