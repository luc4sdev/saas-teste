import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

type Campaign = {
    campaignName: string;
    contactName: string;
    whatsapp: string;
    email: string;
    headline: string;
    subheadline?: string;
    logo?: string;
    image?: string;
};

interface CustomLandingPageProps {
    campaign: Campaign;
}

export async function CustomLandingPage({ campaign }: CustomLandingPageProps) {
    return (
        <div className="w-full custom-bg">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:h-screen mt-10 md:mt-20 px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="col-span-1 flex flex-col justify-center items-center md:mt-[10vh]">
                            {campaign.logo && (
                                <div className="mb-5">
                                    <img src={campaign.logo} alt="Logo da campanha" className="max-w-xs mx-auto" />
                                </div>
                            )}

                            <h1 className="text-4xl md:text-5xl text-center md:text-left text-primary font-extrabold leading-[40px] md:leading-[64px]">
                                {campaign.headline}
                            </h1>
                            {campaign.subheadline && (
                                <h2 className="text-xl text-center md:text-left text-gray-600 mt-4">
                                    {campaign.subheadline}
                                </h2>
                            )}

                            <div className="w-full mt-6">
                                <h2 className="text-xl text-center md:text-left leading-8">
                                    <CheckCircle className="inline size-4 mr-2 text-emerald-500" />
                                    Entre em contato conosco pelo WhatsApp
                                </h2>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-2 w-full mt-6">
                                <a
                                    href={`https://wa.me/${campaign.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="xl" className="font-extrabold">
                                        Fale Conosco
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center mt-10 md:mt-0">
                            {campaign.image && (
                                <img
                                    src={campaign.image}
                                    alt="Imagem da campanha"
                                    className="w-full h-auto max-w-lg object-cover rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
