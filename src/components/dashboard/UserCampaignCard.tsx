'use client'

import { CampaignDataWithUserEmail } from "@/app/server/get-campaigns"
import { deleteCampaign } from "@/app/server/delete-campaign"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
import { Trash, Copy, Check } from "lucide-react"
import { useState } from "react"
import { toastMessage } from "@/lib/utils"


interface CampaignCardProps {
    campaigns: CampaignDataWithUserEmail[]
}

export function UserCampaignCardList({ campaigns: initialCampaigns }: CampaignCardProps) {
    const [campaigns, setCampaigns] = useState(initialCampaigns)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleDelete = async (id: string, logoUrl?: string, imageUrl?: string) => {
        const confirmed = confirm("Tem certeza que deseja excluir esta campanha?")
        if (!confirmed) return

        const result = await deleteCampaign(id, logoUrl, imageUrl)

        if (result.success) {
            toastMessage({
                message: "Campanha deletada com sucesso!",
                type: "success"
            })
            setCampaigns(prev => prev.filter(c => c.id !== id))
        } else {
            alert(result.error || "Erro ao excluir campanha.")
        }
    }

    const copyLandingLink = (id: string) => {
        const landingUrl = `${window.location.origin}/landing/${id}`
        navigator.clipboard.writeText(landingUrl)
            .then(() => {
                setCopiedId(id)
                setTimeout(() => setCopiedId(null), 2000)
                toastMessage({
                    message: "Link copiado!",
                    type: "success"
                })
            })
            .catch(() => {
                toastMessage({
                    message: "Erro ao copiar",
                    type: "error"
                })
            })
    }

    if (campaigns.length === 0) {
        return <p className="text-muted-foreground">Nenhuma campanha encontrada.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
                <Card key={campaign.id} className="w-[320px] hover:shadow-xl transition relative group">
                    <button
                        onClick={() => handleDelete(campaign.id, campaign.logoUrl, campaign.imageUrl)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white z-10"
                        title="Excluir campanha"
                    >
                        <Trash className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => copyLandingLink(campaign.id)}
                        className="absolute top-10 right-2 p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white z-10"
                        title="Copiar link da landing page"
                    >
                        {copiedId === campaign.id ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>

                    {campaign.imageUrl && (
                        <CardHeader className="p-0 relative h-40">
                            <Image
                                src={campaign.imageUrl}
                                alt="Imagem de fundo da campanha"
                                fill
                                className="rounded-t-lg object-cover"
                            />
                            {campaign.logoUrl && (
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="relative w-20 h-20">
                                        <Image
                                            src={campaign.logoUrl}
                                            alt="Logo da campanha"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </CardHeader>
                    )}

                    <CardContent className="pt-4 space-y-2">
                        <h2 className="text-lg font-bold">{campaign.campaignName}</h2>
                        <p className="text-sm text-muted-foreground">📢 {campaign.headline}</p>
                        <p className="text-sm text-muted-foreground">👤 Responsável: {campaign.contactName}</p>
                        <p className="text-sm text-muted-foreground">
                            📅 {format(new Date(campaign.createdAt), "dd/MM/yyyy", {
                                locale: ptBR,
                            })}
                        </p>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center">
                        <span className="text-sm text-foreground">
                            Contato: {campaign.whatsapp}
                        </span>
                        <div className="flex gap-2">
                            <Link href={`/landing/${campaign.id}`} passHref>
                                <Button variant="outline" size="sm">
                                    Ver Landing
                                </Button>
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}