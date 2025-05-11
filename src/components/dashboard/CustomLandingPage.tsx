import { Button } from "../ui/button";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Campaign = {
    id: string;
    userId: string;
    campaignName: string;
    contactName: string;
    whatsapp: string;
    email: string;
    headline: string;
    subheadline?: string;
    logoUrl?: string;
    imageUrl?: string;
    createdAt: number;
};

interface CustomLandingPageProps {
    campaign: Campaign;
}

export async function CustomLandingPage({ campaign }: CustomLandingPageProps) {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header/Navbar */}
            <header className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
                {campaign.logoUrl && (
                    <div className="flex justify-center md:justify-start">
                        <img
                            src={campaign.logoUrl}
                            alt="Logo da campanha"
                            className="h-12 object-contain"
                        />
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content Left */}
                    <div className="space-y-8 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary">
                            {campaign.headline}
                        </h1>

                        {campaign.subheadline && (
                            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                                {campaign.subheadline}
                            </p>
                        )}

                        <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
                            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <div className="bg-emerald-100 p-2 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                                <span className="text-gray-700">Atendimento personalizado</span>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className="text-gray-700">Resposta rápida via WhatsApp</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <a
                                href={`https://wa.me/${campaign.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="xl" className="gap-2 group font-semibold">
                                    Fale conosco agora
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </a>
                        </div>
                    </div>

                    {campaign.imageUrl && (
                        <div className="relative">
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src={campaign.imageUrl}
                                    alt="Imagem da campanha"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-100 hidden md:block">
                                <span className="font-medium text-gray-500">{campaign.contactName}</span>
                                <p className="text-sm text-gray-500">{campaign.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="py-8 px-4 border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} {campaign.campaignName}. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}