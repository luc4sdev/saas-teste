"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";

export async function deleteWorkout(id: string) {
    const session = await auth();
    if (!session?.user) return null;
    if (session.user.id !== process.env.ADMIN_ID) return null;

    try {
        const batch = db.batch();

        const workoutRef = db.collection("workouts").doc(id);
        batch.delete(workoutRef);

        const customersSnapshot = await db
            .collection("customers")
            .where("currentWorkoutId", "==", id)
            .get();


        customersSnapshot.docs.forEach((doc) => {
            const customerRef = db.collection("customers").doc(doc.id);
            batch.update(customerRef, { currentWorkoutId: null });
        });

        await batch.commit();

        return { id };
    } catch (error) {
        console.error("Erro ao deletar treino e atualizar clientes:", error);
        return null;
    }
}