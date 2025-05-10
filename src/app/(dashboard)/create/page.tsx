
import { CreateCustomerForm } from "@/components/dashboard/CreateCustomerForm";
import { auth } from "@/lib/auth";
import { Smile } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ClickFlow - Criar",
    description: "ClickFlow - Criar",
};

export default async function CreatePage() {
    const session = await auth()
    return (
        <div>
            <div className="h-screen flex flex-col gap-10 items-center justify-center max-w-xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-xl md:text-4xl font-bold text-white">Olá {session?.user.name} <Smile className="size-5 text-yellow-500 inline ml-2" /></h1>
                    <h1 className="text-lg md:text-3xl font-bold text-white">Preencha com suas informações</h1>
                    <CreateCustomerForm />
                </div>

            </div>
        </div>
    )
}