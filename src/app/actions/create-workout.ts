"use server";

import { WorkoutFormData } from '@/components/admin/CreateWorkoutForm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function createWorkout(formData: WorkoutFormData) {
    const session = await auth();
    if (!session?.user) return null;
    if (session.user.id !== process.env.ADMIN_ID) return null;

    try {
        const workoutRef = db.collection("workouts").doc();

        const workoutData = {
            id: workoutRef.id,
            name: formData.name,
            workoutType: formData.workoutType,
            difficulty: formData.difficulty,
            goal: formData.goal,
            category: formData.category,
            weeklyFrequency: formData.weeklyFrequency,
            subWorkouts: formData.subWorkouts,
            createdAt: Timestamp.now().toMillis(),
        };

        await workoutRef.set(workoutData);

        return workoutData;
    } catch (error) {
        console.error("Erro ao criar treino:", error);
        return null;
    }
}
