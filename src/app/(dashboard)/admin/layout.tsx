import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()

    if (!session || session?.user.id !== process.env.ADMIN_ID) {
        return notFound();
    }
    return (
        <>{children}</>
    );
}