import { getCustomerData } from "@/app/server/get-customer-data";
import { getWorkoutData } from "@/app/server/get-workouts-data";
import { EditCustomerForm } from "@/components/dashboard/EditCustomerForm";
import Pricing from "@/components/dashboard/Pricing";
import { WorkoutList } from "@/components/dashboard/WorkoutList";
import { auth } from "@/lib/auth";
import { Exercise } from "@/app/server/get-exercises-data";

async function fetchExerciseDetails(exercises: { id: string }[]): Promise<Exercise[]> {
    const exercisePromises = exercises.map(async (exercise) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exercises/${exercise.id}`);
        if (!response.ok) {
            console.error(`Erro ao buscar exercício ${exercise.id}`);
            return null;
        }
        return response.json();
    });
    const results = await Promise.all(exercisePromises);
    return results.filter((result): result is Exercise => result !== null);
}

export default async function CustomerPage({
    params,
}: {
    params: Promise<{ customerId: string }>;
}) {
    const { customerId } = await params;
    const customerData = await getCustomerData(customerId);
    const session = await auth()

    if (!session?.user.isSubscribed) {
        return (
            <div className="flex flex-col gap-3 px-4 py-10">
                <Pricing customer={customerData} />
            </div>
        );
    }

    let isWorkoutExpired = false;
    let updateDate = "Data não disponível";
    let nextUpdateDate = "Data não disponível";
    if (customerData.lastWorkoutUpdate) {
        const lastUpdateMillis = customerData.lastWorkoutUpdate;
        const sixWeeksInMillis = 6 * 7 * 24 * 60 * 60 * 1000;
        const offsetMillis = 3 * 60 * 60 * 1000;

        // Data de atualização
        const adjustedLastUpdateMillis = lastUpdateMillis - offsetMillis;
        const lastUpdate = new Date(adjustedLastUpdateMillis);
        updateDate = lastUpdate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        // Data de próxima troca (3 meses em milissegundos)
        const expirationMillis = adjustedLastUpdateMillis + sixWeeksInMillis;
        const expirationDate = new Date(expirationMillis);
        nextUpdateDate = expirationDate.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const currentDate = new Date();
        isWorkoutExpired = currentDate.getTime() > expirationMillis;
    }

    if (isWorkoutExpired || !customerData.currentWorkoutId) {
        return (
            <div className="flex flex-col gap-3 px-4 py-10">
                <h1 className="text-lg font-bold">Olá {customerData.name.split(" ")[0]}, atualize suas informações para gerar seu novo treino:</h1>
                <EditCustomerForm customer={customerData} />
            </div>
        );
    }

    const workout = await getWorkoutData(customerData.currentWorkoutId);
    const allExercises = workout.subWorkouts.flatMap(sub => sub.exercises);
    const exerciseDetails = await fetchExerciseDetails(allExercises);

    // Combinar dados do Workout com detalhes dos exercícios
    const enrichedWorkout = {
        ...workout,
        subWorkouts: workout.subWorkouts.map(subWorkout => ({
            ...subWorkout,
            exercises: subWorkout.exercises.map(exercise => {
                const details = exerciseDetails.find(d => d.id === exercise.id);
                return {
                    ...exercise,
                    name: details?.name,
                    category: details?.category,
                    description: details?.description,
                    videoUrl: details?.videoUrl
                };
            }),
        })),
    };



    return (
        <div className="flex flex-col gap-3 px-4 py-10">
            <h1 className="text-lg font-bold">Olá {customerData.name.split(" ")[0]}, veja abaixo seu treino:</h1>

            {workout && <WorkoutList workout={enrichedWorkout} updateDate={updateDate} nextUpdateDate={nextUpdateDate} />}
        </div>
    );
}