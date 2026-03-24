import Hero from '@/components/home/Hero';
import NamazTimetable from '@/components/home/NamazTimetable';
import AboutSnippet from '@/components/home/AboutSnippet';
import LeadershipSection from '@/components/home/LeadershipSection';
import ContributeSection from '@/components/home/ContributeSection';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
    await dbConnect();
    const qrSetting = await Setting.findOne({ key: 'contributionQr' }).lean();
    const contributionQr = qrSetting?.value || null;

    return (
        <div className="flex flex-col">
            <Hero />
            <NamazTimetable />
            <AboutSnippet />
            <LeadershipSection />
            <ContributeSection contributionQr={contributionQr} />
        </div>
    );
}
