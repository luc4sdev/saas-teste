'use client'
import { CampaignCard } from "./CampaignCard";

interface Campaign {
    id: string;
    title: string;
    objective: string;
    audience: string;
    imageUrl: string;
    cta: string;
}

interface CampaignSectionProps {
    title: string;
    campaigns: Campaign[];
}

export function CampaignSection({ title, campaigns }: CampaignSectionProps) {
    return (
        <div className="my-10 space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex overflow-x-auto gap-4 py-2">
                {campaigns.map((campaign) => (
                    <CampaignCard
                        key={campaign.id}
                        {...campaign}
                    />
                ))}
            </div>
        </div>
    );
}
