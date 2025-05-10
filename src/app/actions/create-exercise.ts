"use server";

import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function createExercise(formData: {
    name: string;
    category: string;
    videoUrl: string;
    description: string;
}) {
    const session = await auth();
    if (!session?.user) return null;
    if (session.user.id !== process.env.ADMIN_ID) return null;

    try {
        const exerciceRef = db.collection("exercises").doc();

        const exerciseData = {
            id: exerciceRef.id,
            name: formData.name,
            category: formData.category,
            videoUrl: formData.videoUrl,
            description: formData.description,
            createdAt: Timestamp.now().toMillis(),
        };

        await exerciceRef.set(exerciseData);

        return exerciseData;
    } catch (error) {
        console.error("Erro ao criar exercício:", error);
        return null;
    }
}
