import { CampaignDataWithUserEmail, getCampaignById } from "@/app/server/get-campaigns";
import { CustomLandingPage } from "@/components/dashboard/CustomLandingPage";

export default async function LandingPage({
    params,
}: Readonly<{
    params: Promise<{ id: string }>;
}>) {
    const { id } = await params;

    const campaign: CampaignDataWithUserEmail | null = await getCampaignById(id as string);

    return campaign && <CustomLandingPage campaign={campaign} />;
}
