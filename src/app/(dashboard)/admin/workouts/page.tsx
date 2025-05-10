import { getExercicesData } from "@/app/server/get-exercises-data";
import { getWorkoutsData } from "@/app/server/get-workouts-data";
import { CreateWorkoutForm } from "@/components/admin/CreateWorkoutForm";
import { WorkoutsTable } from "@/components/admin/WorkoutsTable";

export default async function Workouts() {
    const workoutsData = await getWorkoutsData()
    const exercicesData = await getExercicesData()
    return (
        <div className="flex flex-col justify-center items-center p-10">
            <h1 className="mb-5 font-bold text-2xl">Treinos</h1>
            <div className="w-full flex justify-end">
                <CreateWorkoutForm exercises={exercicesData} />
            </div>
            {workoutsData.length > 0 && <WorkoutsTable workouts={workoutsData} exercises={exercicesData} />}
        </div>
    )
}