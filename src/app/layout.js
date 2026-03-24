import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Izzathul Islam ICC",
  description: "Mosque Management System",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? verifyToken(token) : null;

  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-gray-50 text-gray-900 scroll-smooth flex flex-col min-h-screen`}>
        <GlobalHeader user={user} />
        {/* Main Content wrapper */}
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <GlobalFooter />
      </body>
    </html>
  );
}
