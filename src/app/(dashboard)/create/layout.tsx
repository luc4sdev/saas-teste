import { getCustomerId } from "@/app/server/get-customer-data";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    if (!session) {
        redirect("/")
    }
    const customerId = await getCustomerId(session.user?.id as string)

    if (customerId) {
        redirect(`/${customerId}`)
    }
    return (
        <>{children}</>
    );
}