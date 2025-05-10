import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { manageAuth } from "@/app/actions/manage-auth";

export default async function Pricing() {
    const session = await auth()

    return (
        <section className="mt-56 text-center px-6">
            <h2 className="text-4xl font-extrabold mb-12">Escolha seu Plano</h2>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-10">
                <div className="bg-primary rounded-2xl p-1">
                    <Card className="w-full max-w-sm bg-gray-800 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between rounded-b-none">
                        <CardHeader>
                            <CardTitle className="text-3xl font-semibold">Plano Mensal</CardTitle>
                            <CardDescription className="text-3xl text-primary font-bold space-y-2">
                                <div className="text-sm text-gray-400">
                                    <p>De <span className="line-through ">R$ 149,90</span>, por</p>
                                </div>
                                <p>R$ 119,90<span className="text-base">/mês</span></p>
                                <p className="text-sm font-semibold text-gray-400">Desconto de 20%</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 text-left text-lg">
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Treinos Personalizados</li>
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Acesso a vídeos dos exercícios</li>
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Suporte via WhatsApp</li>
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Ajustes a cada 6 semanas no treino</li>
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Métodos avançados</li>
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Download dos treinos em PDF</li>
                                <li className="flex items-center gap-2"><CircleCheck className="w-4 h-4 text-emerald-500" />Bônus +</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {session ? (
                        <div>
                            <Link href='/create'> <Button size='lg' className="w-full font-bold bg-primary">Assine Agora</Button></Link>
                        </div>
                    ) :
                        (
                            <form action={manageAuth}>
                                <Button size='lg' className="w-full font-bold bg-primary">Assine Agora</Button>
                            </form>
                        )}
                </div>
            </div>
        </section>
    );
}
