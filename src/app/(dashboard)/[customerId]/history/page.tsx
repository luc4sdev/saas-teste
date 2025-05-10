import { getCustomerData } from "@/app/server/get-customer-data"
import { getWorkoutsData, Workout } from "@/app/server/get-workouts-data"
import { CustomerWorkoutHistoryCard } from "@/components/dashboard/CustomerWorkoutHistoryCard"
import { HistoryIcon } from "lucide-react";


interface WorkoutHistoryItem {
    workout: Workout;
    date: Date;
}

export default async function History({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params
    const customer = await getCustomerData(customerId)
    const workouts = await getWorkoutsData()

    const customerWorkoutsHistory: WorkoutHistoryItem[] | undefined = customer?.workoutsHistory
        ?.map(historyItem => {
            const workout = workouts.find(w => w.id === historyItem.workoutId)
            return workout ? {
                workout,
                date: new Date(historyItem.date)
            } : null
        })
        .filter((item): item is WorkoutHistoryItem => item !== null)
        .sort((a, b) => b.date.getTime() - a.date.getTime())

    return (
        <div className="flex flex-col gap-3 px-4 py-10">
            <h1 className="text-lg font-bold">Veja seu histórico de treinos <HistoryIcon className="size-4 inline ml-2" /></h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {customerWorkoutsHistory?.length ? (
                    customerWorkoutsHistory.map(({ workout, date }, index) => (
                        <CustomerWorkoutHistoryCard
                            key={index}
                            workout={workout}
                            date={date}
                        />
                    ))
                ) : (
                    <p className="text-center text-zinc-400 py-8">
                        Nenhum treino encontrado em seu histórico.
                    </p>
                )}
            </div>
        </div>
    )
}