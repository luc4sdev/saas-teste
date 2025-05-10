"use server";

import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export async function updateExercise(
    id: string,
    formData: {
        name: string;
        category: string;
        videoUrl: string;
        description: string;
    }
) {
    const session = await auth();
    if (!session?.user) return null;
    if (session.user.id !== process.env.ADMIN_ID) return null;

    try {
        const exerciseRef = db.collection("exercises").doc(id);

        const updatedData = {
            name: formData.name,
            category: formData.category,
            videoUrl: formData.videoUrl,
            description: formData.description,
            updatedAt: Timestamp.now().toMillis(),
        };

        await exerciseRef.update(updatedData);

        return { id, ...updatedData };
    } catch (error) {
        console.error("Erro ao atualizar exercício:", error);
        return null;
    }
}