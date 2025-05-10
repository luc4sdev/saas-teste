"use client"

import { CampaignDataWithUserEmail } from "@/app/server/get-campaigns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { Button } from "../ui/button"

interface CampaignCardProps {
    campaigns: CampaignDataWithUserEmail[]
}

export function UserCampaignCardList({ campaigns }: CampaignCardProps) {
    if (campaigns.length === 0) {
        return <p className="text-muted-foreground">Nenhuma campanha encontrada.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>{campaign.campaignName}</CardTitle>
                        <CardDescription>
                            Criado em{" "}
                            {format(new Date(campaign.createdAt), "dd 'de' MMMM 'de' yyyy", {
                                locale: ptBR,
                            })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                        <p>
                            <span className="font-medium text-primary">Responsável:</span>{" "}
                            {campaign.contactName}
                        </p>
                        <p>
                            <span className="font-medium text-primary">WhatsApp:</span>{" "}
                            {campaign.whatsapp}
                        </p>
                        <p>
                            <span className="font-medium text-primary">E-mail:</span>{" "}
                            {campaign.email}
                        </p>
                        {campaign.headline && (
                            <p>
                                <span className="font-medium text-primary">Headline:</span>{" "}
                                {campaign.headline}
                            </p>
                        )}
                    </CardContent>
                    <Link href={`/landing/${campaign.id}`} passHref>
                        <Button className="w-full mt-4">
                            Ver Landing Page
                        </Button>
                    </Link>
                </Card>
            ))}
        </div>
    )
}
