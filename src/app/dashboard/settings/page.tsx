import { PortalStripeButton } from "@/components/dashboard/PortalStripeButton";
import { auth } from "@/lib/auth";

export default async function Settings() {
    const session = await auth()
    return (
        <div className="flex flex-col gap-3 px-4 py-10">
            <h1 className="text-lg font-bold">Configurações</h1>
            {session?.user.isSubscribed !== undefined && <PortalStripeButton />}
        </div>
    )
}