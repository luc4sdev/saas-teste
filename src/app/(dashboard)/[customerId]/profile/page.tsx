import { getCustomerData } from "@/app/server/get-customer-data";
import { EditCustomerForm } from "@/components/dashboard/EditCustomerForm";
import { TriangleAlert } from "lucide-react";

export default async function Profile({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params
    const customerData = await getCustomerData(customerId)
    return (
        <div className="flex flex-col gap-3 px-4 py-10">
            <h1 className="text-lg font-bold">Olá {customerData.name.split(' ')[0]}, edite suas informações pessoais:</h1>
            <p className="text-sm text-red-600 flex items-center gap-2">
                <TriangleAlert className="size-8 md:size-4 text-yellow-500" />
                Atenção: Ao atualizar suas informações, seu treino atual será recalculado e poderá ser ajustado de acordo com seus novos dados.
            </p>
            <EditCustomerForm customer={customerData} />
        </div>
    )
}