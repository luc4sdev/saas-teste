import { getCustomerData } from "@/app/server/get-customer-data";
import { getExtraWorkoutsData } from "@/app/server/get-workouts-data"
import Pricing from "@/components/dashboard/Pricing";
import { WorkoutInfoList } from "@/components/dashboard/WorkoutInfoList"
import { auth } from "@/lib/auth";

export default async function Workouts({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const customerData = await getCustomerData(customerId);
    const workouts = await getExtraWorkoutsData()
    const session = await auth()

    if (!session?.user.isSubscribed) {
        return (
            <div className="flex flex-col gap-3 px-4 py-10">
                <Pricing customer={customerData} />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-3 px-4 py-10">
            <h1 className="text-lg font-bold">Quer incrementar ainda mais seus treinos?</h1>
            <h1 className="text-base font-bold">Escolha abaixo um de nossos treinos exclusivos de mobilidade e fortalecimento</h1>
            <WorkoutInfoList workouts={workouts} />
        </div>
    )
}