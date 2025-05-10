"use server";

import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Exercise, SubWorkout } from '../server/get-workouts-data';

export async function deleteExercise(id: string) {
    const session = await auth();
    if (!session?.user) return null;
    if (session.user.id !== process.env.ADMIN_ID) return null;

    try {
        const batch = db.batch();

        const exerciseRef = db.collection("exercises").doc(id);
        batch.delete(exerciseRef);

        const workoutsSnapshot = await db.collection("workouts").get();

        workoutsSnapshot.docs.forEach((doc) => {
            const workout = doc.data();
            let updated = false;

            const updatedSubWorkouts = workout.subWorkouts.map((subWorkout: SubWorkout) => {
                const exercises = subWorkout.exercises.filter((exercise: Exercise) => exercise.id !== id);
                if (exercises.length !== subWorkout.exercises.length) {
                    updated = true;
                }
                return {
                    ...subWorkout,
                    exercises,
                };
            });

            if (updated) {
                const workoutRef = db.collection("workouts").doc(doc.id);
                batch.update(workoutRef, { subWorkouts: updatedSubWorkouts });
            }
        });

        await batch.commit();

        return { id };
    } catch (error) {
        console.error("Erro ao deletar exercício e atualizar workouts:", error);
        return null;
    }
}