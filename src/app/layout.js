import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { getPrayerTimes } from '@/lib/prayerTimes';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: {
    template: '%s | Izzathul Islam ICC',
    default: 'Izzathul Islam ICC - Community Mosque & Center',
  },
  description: "Official portal for Izzathul Islam Islamic Cultural Center. Join our community, view announcements, and manage your membership.",
  keywords: ["Mosque", "Islamic Center", "Izzathul Islam", "Community", "Muslim"],
  authors: [{ name: "Izzathul Islam ICC" }],
  openGraph: {
    title: "Izzathul Islam ICC - Community Mosque & Center",
    description: "Official portal for Izzathul Islam Islamic Cultural Center. Join our community, view announcements, and manage your membership.",
    type: "website",
    locale: "en_US",
    siteName: "Izzathul Islam ICC"
  }
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? verifyToken(token) : null;
  const apiTimings = await getPrayerTimes();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-gray-50 text-gray-900 scroll-smooth flex flex-col min-h-screen`}>
        <GlobalHeader user={user} />
        {/* Main Content wrapper */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <GlobalFooter apiTimings={apiTimings} />
      </body>
    </html>
  );
}
