"use server";

import { CreateCustomerSchema } from '@/components/dashboard/CreateCustomerForm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { generateCustomerWorkout } from '../server/generate-customer-workout';
import { recommendWorkout } from './update-customer';
import { getCustomerData } from '../server/get-customer-data';

export async function createCustomer(formData: CreateCustomerSchema) {
    const session = await auth();
    if (!session?.user) return null;

    try {
        const customerRef = db.collection("customers").doc();

        const customerData = {
            id: customerRef.id,
            userId: session.user.id,
            name: formData.name,
            gender: formData.gender,
            age: formData.age,
            weight: formData.weight,
            goal: formData.goal,
            trainingTime: formData.trainingTime,
            weeklyFrequency: formData.weeklyFrequency,
            muscleFocus: formData.muscleFocus,
            createdAt: Timestamp.now().toMillis(),
        };

        await customerRef.set(customerData);
        const newCustomerData = await getCustomerData(customerData.id)
        const { workout_id } = await recommendWorkout(newCustomerData)

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
        return customerData;
    } catch (error) {
        console.error("Erro ao criar cliente:", error);
        return null;
    }
}
