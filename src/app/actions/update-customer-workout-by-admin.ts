"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { getCustomerData } from "../server/get-customer-data";

export async function updateCustomerWorkoutByAdmin(customerId: string, workoutId: string): Promise<boolean> {
    const session = await auth();
    if (!session?.user) return false;
    if (session.user.id !== process.env.ADMIN_ID) return false;

    try {
        const customerData = await getCustomerData(customerId);
        if (!customerData) {
            return false;
        }

        const customerRef = db.collection("customers").doc(customerId);
        const customerDoc = await customerRef.get();
        const currentData = customerDoc.data();

        const currentWorkoutsHistory: { workoutId: string, date: number }[] = currentData?.workoutsHistory || [];
        const lastWorkoutUpdate = Timestamp.now().toMillis();
        currentWorkoutsHistory.push({ workoutId: workoutId, date: lastWorkoutUpdate });

        await customerRef.update({
            currentWorkoutId: workoutId,
            lastWorkoutUpdate: lastWorkoutUpdate,
            workoutsHistory: currentWorkoutsHistory,
        });

        return true;
    } catch (error) {
        return false;
    }
}