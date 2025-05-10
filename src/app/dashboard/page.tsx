import { CampaignSection } from "@/components/dashboard/CampaignSection";
import Pricing from "@/components/dashboard/Pricing";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { getCampaignsByUserId } from "../server/get-campaigns";
import { notFound } from "next/navigation";
import { UserCampaignCardList } from "@/components/dashboard/UserCampaignCard";

const mockCampaigns = [
    {
        id: "1",
        title: "Campanha Verão",
        objective: "Aumentar vendas de roupas de verão",
        audience: "Mulheres 25-40",
        imageUrl: "/landing-page.png",
        cta: "Ideal para e-commerce",
    },
    {
        id: "2",
        title: "Lead para consultoria",
        objective: "Gerar leads para serviços financeiros",
        audience: "Profissionais liberais",
        imageUrl: "/landing-page.png",
        cta: "Converta com WhatsApp",
    },
    // adicione mais mockups
];
export default async function UserPage() {
    const session = await auth()
    if (!session?.user.id) {
        return notFound()
    }
    const campaigns = await getCampaignsByUserId(session?.user?.id)

    // if (!session?.user.isSubscribed) {
    //     return (
    //         <div className="flex flex-col gap-3 px-4 py-10">
    //             {/* <Pricing customer={customerData} /> */}
    //         </div>
    //     );
    // }


    return (
        <div className="flex flex-col gap-3 px-4 py-10">
            <h1 className="text-lg font-bold">Olá {session?.user.name?.split(" ")[0]}</h1>
            <Separator />
            <div>
                <h1 className="text-2xl font-bold mb-4">Minhas Campanhas</h1>
                <UserCampaignCardList campaigns={campaigns} />
            </div>
            <CampaignSection title="Novas Campanhas" campaigns={mockCampaigns} />
            <CampaignSection title="Mais Usadas" campaigns={mockCampaigns} />
            <CampaignSection title="Destaques" campaigns={mockCampaigns} />
        </div>
    );
}