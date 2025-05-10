import { EnumCategory } from "@/components/admin/CreateExerciseForm";
import { db } from "@/lib/firebase";

export type Exercise = {
    id: string;
    name: string;
    category: EnumCategory;
    videoUrl: string;
    description: string;
    createdAt: number;
    updatedAt?: number;
};
export async function getExercicesData() {
    const snapshot = await db.collection("exercises").get()

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Exercise[];
}

export async function getExerciseData(exerciseId: string) {
    const snapshot = await db.collection("exercises").doc(exerciseId).get()

    return snapshot.data() as Exercise
}