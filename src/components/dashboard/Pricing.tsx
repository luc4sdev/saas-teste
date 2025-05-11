"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import { useStripe } from "@/hooks/useStripe";

export default function Pricing() {
    const { createStripeCheckout } = useStripe()

    return (
        <div className="flex flex-col justify-center items-center text-center px-6">
            <h1 className="text-lg font-bold">Para começar a criar suas landing pages exclusivas, escolha o plano abaixo:</h1>
            <div className="flex flex-col justify-center items-center space-y-8 mt-8">
                <h2 className="text-3xl font-extrabold mb-12 text-yellow-500">Plano Inicial</h2>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-10">

                    <div className="bg-primary rounded-2xl p-1">
                        <Card className="w-full max-w-sm bg-gray-800 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between rounded-b-none">
                            <CardHeader>
                                <CardTitle className="text-3xl font-semibold">Plano Mensal</CardTitle>
                                <CardDescription className="text-3xl text-primary font-bold space-y-2">
                                    <div className="text-sm text-gray-400">
                                        <p>De <span className="line-through ">R$ 59,90</span>, por</p>
                                    </div>
                                    <p>R$ 39,90<span className="text-base">/mês</span></p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4 text-left text-lg">
                                    <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Até 3 campanhas ativas</li>
                                    <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Link exclusivo e personalizável</li>
                                    <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Upload de logo e imagens</li>
                                    <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Edição de textos e campos de contato</li>
                                    <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Pré-visualização em tempo real</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Button
                            onClick={() => createStripeCheckout({
                                planType: "monthly",
                            })}
                            size='lg'
                            className="w-full font-bold bg-primary">
                            Assinar por R$ 39,90/mês
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
