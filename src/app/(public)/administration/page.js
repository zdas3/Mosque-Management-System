import dbConnect from '@/lib/db';
import Leadership from '@/models/Leadership';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
    title: 'Administration | Izzathul Islam ICC',
    description: 'Meet the Leadership, Committee Members, and Teachers of Izzathul Islam ICC.',
};

export default async function AdministrationPage() {
    await dbConnect();

    const [leadership, committee, teachers] = await Promise.all([
        Leadership.find({ category: 'Leadership' }).sort({ order: 1, createdAt: 1 }).lean(),
        Leadership.find({ category: 'Committee Member' }).sort({ order: 1, createdAt: 1 }).lean(),
        Leadership.find({ category: 'Education Staff' }).sort({ order: 1, createdAt: 1 }).lean()
    ]);

    const renderPersonCard = (person) => (
        <div key={person._id.toString()} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-emerald-50 relative bg-gray-100 flex items-center justify-center">
                {person.image ? (
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-4xl text-gray-400 font-outfit uppercase">{person.name[0]}</span>
                )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 font-outfit">{person.name}</h3>
            <p className="text-emerald-600 font-medium text-sm mb-4">{person.role}</p>

            {person.contact && (
                <div className="flex gap-3 mt-auto">
                    <a href={`tel:${person.contact}`} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                        <Phone size={18} />
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div className="py-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">Our Administration</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Meet the dedicated individuals who serve, guide, and educate our community.
                    </p>
                </div>

                {/* Leadership Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4 font-outfit">Leadership</h2>
                    {leadership.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {leadership.map(renderPersonCard)}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Information coming soon.</p>
                    )}
                </section>

                {/* Committee Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4 font-outfit">Committee Members</h2>
                    {committee.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {committee.map(renderPersonCard)}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Information coming soon.</p>
                    )}
                </section>

                {/* Teachers Section */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4 font-outfit">Educational Staff</h2>
                    {teachers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {teachers.map(renderPersonCard)}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Information coming soon.</p>
                    )}
                </section>

            </div>
        </div>
    );
}
