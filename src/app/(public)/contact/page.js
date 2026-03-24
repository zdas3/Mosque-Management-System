import dbConnect from '@/lib/db';
import Leadership from '@/models/Leadership';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
    title: 'Contact Us & Committee | Izzathul Islam ICC',
    description: 'Get in touch with Izzathul Islam Islamic Cultural Center and meet our committee and teachers.',
};

export default async function ContactPage() {
    await dbConnect();
    
    const [committee, teachers] = await Promise.all([
        Leadership.find({ category: 'Committee Member' }).sort({ order: 1, createdAt: 1 }).lean(),
        Leadership.find({ category: 'Education Staff' }).sort({ order: 1, createdAt: 1 }).lean()
    ]);

    const renderPersonCard = (person) => (
        <div key={person._id.toString()} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-emerald-50 relative bg-gray-100 flex items-center justify-center">
                {person.image ? (
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl text-gray-400 font-outfit uppercase">{person.name[0]}</span>
                )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 font-outfit">{person.name}</h3>
            <p className="text-emerald-600 font-medium text-sm mb-4">{person.role}</p>

            {person.contact && (
                <div className="flex gap-3 mt-auto">
                    <a href={`tel:${person.contact}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
                        <Phone size={14} /> {person.contact}
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div className="py-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit tracking-tight">Contact Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                        We are here to serve you. Reach out to us for any inquiries, concerns, or support.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 font-outfit">Get in Touch</h2>

                            <ul className="space-y-8">
                                <li className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                        <MapPin className="text-[#008f5d]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Visit Us</h4>
                                        <p className="text-gray-600 leading-relaxed">123 Mosque Street, Community District,<br />City Name, State, 12345</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                        <Phone className="text-[#008f5d]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Call Us</h4>
                                        <p className="text-gray-600 leading-relaxed">+1 (234) 567-8900</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                        <Mail className="text-[#008f5d]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Email Us</h4>
                                        <p className="text-gray-600 leading-relaxed">contact@izzathulislam.com</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                        <Clock className="text-[#008f5d]" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">Office Hours</h4>
                                        <p className="text-gray-600 leading-relaxed">Saturdays & Sundays<br/>Morning: 09:00 AM - 12:00 PM</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full min-h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450937!2d144.95373531531664!3d-37.81720997975179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sus!4v1614246813354!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                {/* Committee Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 font-outfit text-center">Committee Members</h2>
                    {committee.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {committee.map(renderPersonCard)}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                            <p className="text-gray-500 italic">Committee information coming soon.</p>
                        </div>
                    )}
                </section>

                {/* Teachers Section */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 font-outfit text-center">Educational Staff</h2>
                    {teachers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {teachers.map(renderPersonCard)}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
                            <p className="text-gray-500 italic">Teaching staff information coming soon.</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
