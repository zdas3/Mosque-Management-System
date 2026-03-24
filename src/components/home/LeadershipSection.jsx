import dbConnect from '@/lib/db';
import Leadership from '@/models/Leadership';
import { Phone } from 'lucide-react';

export default async function LeadershipSection() {
    await dbConnect();
    const leadership = await Leadership.find({ category: 'Leadership' }).sort({ order: 1, createdAt: 1 }).lean();

    if (!leadership || leadership.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit tracking-tight">Our Leadership</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                        Guided by faith and dedication, our leadership team serves the community with compassion and vision.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {leadership.map((person) => (
                        <div key={person._id.toString()} className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-2">
                            <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-emerald-50 relative bg-gray-50 flex items-center justify-center group-hover:border-emerald-100 transition-colors">
                                {person.image ? (
                                    <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl text-gray-300 font-outfit uppercase font-light">{person.name[0]}</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-outfit tracking-tight">{person.name}</h3>
                            <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                                {person.role}
                            </div>
                            
                            {person.contact && (
                                <div className="mt-auto pt-4 border-t border-gray-50 w-full flex justify-center">
                                    <a href={`tel:${person.contact}`} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium">
                                        <Phone size={16} />
                                        {person.contact}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
