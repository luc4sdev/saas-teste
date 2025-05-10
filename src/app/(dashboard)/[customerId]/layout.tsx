import { getCustomerData } from "@/app/server/get-customer-data";
import { Header } from "@/components/dashboard/Header";
import Navbar from "@/components/dashboard/NavBar";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ customerId: string }>;
}): Promise<Metadata> {
    const { customerId } = await params
    const customerData = await getCustomerData(customerId)
    return {
        title: `ClickFlow - ${customerData.name || "Usuário"}`,
    };
}

export default async function CustomerLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ customerId: string }>;
}>) {
    const { customerId } = await params

    const customerData = await getCustomerData(customerId)

    if (!customerData) return notFound();


    const session = await auth()
    const isOwner = customerData.userId === session?.user?.id

    if (!isOwner) {
        return notFound();
    }
    return (
        <div className="min-h-screen bg-background">
            <Header userName={customerData.name || 'Usuário'} avatarSrc={session.user.image || ''} />
            <main className="pb-16 sm:pb-0 sm:ml-64">
                {children}
            </main>
            <Navbar userName={customerData.name || 'Usuário'} avatarSrc={session.user.image || ''} customerId={customerId} />
        </div>
    );
}
