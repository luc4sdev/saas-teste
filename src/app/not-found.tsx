import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Home, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
    const session = await auth()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-500" />
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Página não encontrada
                </h1>

                <p className="text-lg text-muted-foreground">
                    Oops! Parece que a página que você está procurando não existe ou foi
                    movida.
                </p>

                <Button asChild className="mt-6">
                    <Link href={(session) ? `/dashboard` : '/'} className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        Voltar para a página inicial
                    </Link>
                </Button>
            </div>
        </div>
    );
}