"use server";

import { EditCustomerSchema } from '@/components/dashboard/EditCustomerForm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { CustomerData, getCustomerData } from '../server/get-customer-data';

export async function updateCustomer(
    id: string,
    formData: EditCustomerSchema
) {
    const session = await auth();
    const customerData = await getCustomerData(id)
    if (!session?.user) return null;

    const isOwner = customerData.userId === session?.user?.id

    if (!isOwner) {
        return null
    }

    try {
        const customerRef = db.collection("customers").doc(id);

        const updatedData = {
            age: formData.age,
            weight: formData.weight,
            goal: formData.goal,
            trainingTime: formData.trainingTime,
            weeklyFrequency: formData.weeklyFrequency,
            muscleFocus: formData.muscleFocus,
            updatedAt: Timestamp.now().toMillis(),
        };

        await customerRef.update(updatedData);
        const customerData = await getCustomerData(id)
        const { workout_id } = await recommendWorkout(customerData)

        const customerDoc = await customerRef.get();
        const currentData = customerDoc.data();

        const currentWorkoutsHistory: { workoutId: string, date: number }[] = currentData?.workoutsHistory || [];
        const lastWorkoutUpdate = Timestamp.now().toMillis();
        currentWorkoutsHistory.push({ workoutId: workout_id, date: lastWorkoutUpdate });

        await customerRef.update({
            currentWorkoutId: workout_id,
            lastWorkoutUpdate: Timestamp.now().toMillis(),
            workoutsHistory: currentWorkoutsHistory,
        });

        console.log(`Treino gerado com sucesso para o usuário`);

        return { id, ...updatedData };
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        return null;
    }
}

export const recommendWorkout = async (customerData: CustomerData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ML_URL}/recommend-workout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });

        if (!response.ok) {
            throw new Error('Erro ao recomendar treino');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};