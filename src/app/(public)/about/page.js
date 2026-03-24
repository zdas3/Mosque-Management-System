export const metadata = {
    title: 'About Us | Izzathul Islam ICC',
    description: 'Learn more about Izzathul Islam Islamic Cultural Center',
};

export default function AboutPage() {
    return (
        <div className="py-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-emerald">
                <div className="text-center mb-16 not-prose">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-outfit">About Izzathul Islam</h1>
                    <p className="text-lg text-gray-600">A beacon of knowledge, peace, and community.</p>
                </div>

                <h2>Our History</h2>
                <p>Founded with the core intention to serve the Muslim community, Izzathul Islam ICC has grown from a humble gathering place into a comprehensive Islamic Cultural Center. For decades, we have provided a nurturing environment for spiritual development, educational excellence, and social welfare.</p>

                <h2>Our Vision</h2>
                <p>To establish a vibrant, unified, and progressive Muslim community that actively contributes to the betterment of society while steadfastly adhering to the principles of Islam according to the Quran and Sunnah.</p>

                <h2>Our Mission</h2>
                <ul>
                    <li><strong>Spiritual Growth:</strong> To provide daily prayers, Jumu'ah services, and religious counseling.</li>
                    <li><strong>Education:</strong> To offer authentic Islamic education for all age groups, emphasizing the understanding and implementation of Islamic values.</li>
                    <li><strong>Community Service:</strong> To support the vulnerable through Zakat, charity, and active engagement in social welfare initiatives.</li>
                </ul>

                <h2>Rules & Regulations</h2>
                <p>We kindly request all members and visitors to adhere to the center's guidelines to maintain a peaceful, respectful, and safe environment for worship and learning. Detailed rules and membership policies are available upon request from the administration office.</p>
            </div>
        </div>
    );
}
