import { Header } from "@/components/dashboard/Header";
import Navbar from "@/components/dashboard/NavBar";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const session = await auth()
    return {
        title: `ClickFlow - ${session?.user.name || "Usuário"}`,
    };
}

export default async function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth()
    if (!session) {
        return notFound();
    }
    return (
        <div className="min-h-screen bg-background">
            <Header userName={session.user.name || 'Usuário'} avatarSrc={session.user.image || ''} />
            <main className="pb-16 sm:pb-0 sm:ml-64">
                {children}
            </main>
            <Navbar userName={session.user.name || 'Usuário'} avatarSrc={session.user.image || ''} />
        </div>
    );
}
