import { getExercicesData } from "@/app/server/get-exercises-data";
import { CreateExerciseForm } from "@/components/admin/CreateExerciseForm";
import { ExercisesTable } from "@/components/admin/ExercicesTable";

export default async function Exercises() {
    const exercicesData = await getExercicesData()
    return (
        <div className="flex flex-col justify-center items-center p-10">
            <h1 className="mb-5 font-bold text-2xl">Exercícios</h1>
            <div className="w-full flex justify-end">
                <CreateExerciseForm />
            </div>
            {exercicesData.length > 0 && <ExercisesTable exercises={exercicesData} />}
        </div>
    )
}