"use server";

import { WorkoutFormData } from '@/components/admin/CreateWorkoutForm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function updateWorkout(
    id: string,
    formData: WorkoutFormData
) {
    const session = await auth();
    if (!session?.user) return null;
    if (session.user.id !== process.env.ADMIN_ID) return null;

    try {
        const workoutRef = db.collection("workouts").doc(id);

        const updatedData = {
            name: formData.name,
            workoutType: formData.workoutType,
            difficulty: formData.difficulty,
            goal: formData.goal,
            category: formData.category,
            weeklyFrequency: formData.weeklyFrequency,
            subWorkouts: formData.subWorkouts,
            updatedAt: Timestamp.now().toMillis(),
        };

        await workoutRef.update(updatedData);

        return { id, ...updatedData };
    } catch (error) {
        console.error("Erro ao atualizar treino:", error);
        return null;
    }
}