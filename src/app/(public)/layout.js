export const metadata = {
    title: 'Home | Izzathul Islam ICC',
    description: 'Welcome to Izzathul Islam Islamic Cultural Center',
};

export default function PublicLayout({ children }) {
    return (
        <main className="flex-grow w-full">
            {children}
        </main>
    );
}
