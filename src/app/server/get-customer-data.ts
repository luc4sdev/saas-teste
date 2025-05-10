import { EnumGender, EnumGoal, EnumMuscleFocus, EnumTrainingTime, EnumWeeklyFrequency } from "@/components/dashboard/CreateCustomerForm";
import { db } from "@/lib/firebase";

export type CustomerData = {
    id: string;
    userId: string;
    name: string;
    gender: EnumGender;
    age: number;
    weight: number;
    goal: EnumGoal;
    muscleFocus: EnumMuscleFocus;
    trainingTime: EnumTrainingTime;
    weeklyFrequency: EnumWeeklyFrequency;
    currentWorkoutId?: string | null;
    lastWorkoutUpdate?: number;
    workoutsHistory?: { workoutId: string; date: number }[];
    createdAt: number;
    updatedAt?: number;
};

export type CustomerDataWithEmail = {
    id: string;
    userId: string;
    name: string;
    gender: EnumGender;
    age: number;
    weight: number;
    goal: EnumGoal;
    muscleFocus: EnumMuscleFocus;
    trainingTime: EnumTrainingTime;
    weeklyFrequency: EnumWeeklyFrequency;
    currentWorkoutId?: string;
    lastWorkoutUpdate?: number;
    workoutsHistory?: { workoutId: string; date: number }[];
    email: string;
    createdAt: number;
    updatedAt?: number;
};

export async function getCustomersData() {
    const snapshot = await db.collection("customers").get()

    const customers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as CustomerData[];

    const customersWithEmail = await Promise.all(
        customers.map(async (customer) => {
            let email: string | undefined;
            if (customer.userId) {
                const userSnapshot = await db.collection("users").doc(customer.userId).get();
                if (userSnapshot.exists) {
                    email = userSnapshot.data()?.email as string | undefined;
                }
            }
            return {
                ...customer,
                email,
            };
        })
    );

    return customersWithEmail as CustomerDataWithEmail[];
}
export async function getCustomerData(customerId: string) {
    const snapshot = await db.collection("customers").doc(customerId).get()

    return snapshot.data() as CustomerData
}
export async function getCustomerId(userId: string) {
    if (!userId) return null
    const snapshot = await db
        .collection("customers")
        .where("userId", "==", userId)
        .get();
    return snapshot.docs.map((doc) => doc.id)[0];
}