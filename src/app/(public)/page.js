import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import NamazTimetable from '@/components/home/NamazTimetable';
import LeadershipSection from '@/components/home/LeadershipSection';

const AboutSnippet = dynamic(() => import('@/components/home/AboutSnippet'), { 
    loading: () => <div className="py-32 bg-[#0a0a0a] min-h-[500px]" /> 
});
const ContributeSection = dynamic(() => import('@/components/home/ContributeSection'), { 
    loading: () => <div className="py-32 bg-[#050505] min-h-[500px]" /> 
});
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { getPrayerTimes } from '@/lib/prayerTimes';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
    await dbConnect();
    const qrSetting = await Setting.findOne({ key: 'contributionQr' }).lean();
    const contributionQr = qrSetting?.value || null;
    
    // Fetch dynamic prayer times for Calicut
    const apiTimings = await getPrayerTimes();

    return (
        <div className="flex flex-col">
            <Hero />
            <NamazTimetable apiTimings={apiTimings} />
            <AboutSnippet />
            <LeadershipSection />
            <ContributeSection contributionQr={contributionQr} />
        </div>
    );
}
