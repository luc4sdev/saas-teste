import { EnumCategory as EnumExerciseCategory } from "@/components/admin/CreateExerciseForm";
import { EnumDifficulty, EnumGoal, EnumWeeklyFrequency, EnumWorkoutType, EnumCategory } from "@/components/admin/CreateWorkoutForm";
import { db } from "@/lib/firebase";

export interface Exercise {
    id: string;
    sets: number;
    repetitions: number;
    restTime: number;
    name?: string;
    category?: EnumExerciseCategory;
    description?: string;
    videoUrl?: string;
}

export interface SubWorkout {
    name: string;
    exercises: Exercise[];
}

export interface Workout {
    id: string;
    name: string;
    workoutType: EnumWorkoutType;
    difficulty: EnumDifficulty;
    goal: EnumGoal;
    category: EnumCategory;
    weeklyFrequency: EnumWeeklyFrequency;
    subWorkouts: SubWorkout[];
    createdAt: number;
    updatedAt?: number;
}
export async function getWorkoutsData() {
    const snapshot = await db.collection("workouts").get()

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Workout[];
}

export async function getWorkoutData(workoutId: string) {
    const snapshot = await db.collection("workouts").doc(workoutId).get()

    return snapshot.data() as Workout
}

export async function getExtraWorkoutsData(): Promise<Workout[]> {
    const snapshot = await db.collection("workouts").get();
    const allWorkouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Workout[];

    const targetGoals = ["mobility", "correction", "strengthening"];

    const filteredWorkouts = allWorkouts.filter((workout) =>
        targetGoals.includes(workout.goal)
    );

    return filteredWorkouts;
}