import Link from "next/link";
import { Button } from "../ui/button";
import { manageAuth } from "@/app/actions/manage-auth";
import { auth } from "@/lib/auth";
import { CheckCircle, Target } from "lucide-react";

export async function Hero() {
    const session = await auth();
    return (
        <div className="flex md:h-screen mt-10 md:mt-20 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="col-span-1 flex flex-col gap-3 md:mt-[10vh]">
                    <div className="flex-col justify-center items-center">
                        <h1 className="text-4xl md:text-5xl text-center md:text-left text-primary font-extrabold leading-[40px] md:leading-[64px]">
                            Transforme cliques em resultados com campanhas inteligentes.
                        </h1>
                    </div>
                    <br />
                    <h2 className="text-xl text-center md:text-left leading-8">
                        <CheckCircle className="inline size-4 mr-2 text-emerald-500" />
                        Crie landing pages personalizadas com links únicos.
                    </h2>
                    <h2 className="text-xl text-center md:text-left leading-8">
                        <CheckCircle className="inline size-4 mr-2 text-emerald-500" />
                        Acompanhe métricas e otimize campanhas com inteligência.
                    </h2>
                    <h2 className="text-xl text-center md:text-left leading-8">
                        <CheckCircle className="inline size-4 mr-2 text-emerald-500" />
                        Tudo em uma única plataforma SaaS escalável.
                    </h2>
                    {session ? (
                        <div className="flex items-center justify-center md:justify-start gap-2 w-full mt-10">
                            <Link href="/create">
                                <Button size="xl" className="font-extrabold">
                                    Comece Agora
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form className="flex items-center justify-center md:justify-start gap-2 w-full mt-10" action={manageAuth}>
                            <Button size="xl" className="font-extrabold">
                                Comece Agora
                            </Button>
                        </form>
                    )}
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Target className="text-primary size-60" />
                </div>
            </div>
        </div>
    );
}
