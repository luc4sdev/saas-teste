"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toastMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CustomerDataWithEmail } from "@/app/server/get-customer-data";
import { WorkoutsDialog } from "./WorkoutsDialog";
import { Workout } from "@/app/server/get-workouts-data";
import { updateCustomerWorkoutByAdmin } from "@/app/actions/update-customer-workout-by-admin";

const formSchema = z.object({
    currentWorkoutId: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface EditCustomerWorkoutFormProps {
    customer: CustomerDataWithEmail;
    setIsEditModalOpen: (editModalOpen: boolean) => void;
    workouts: Workout[];
}

export function EditCustomerWorkoutForm({ customer, setIsEditModalOpen, workouts }: EditCustomerWorkoutFormProps) {
    const router = useRouter();
    const { handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentWorkoutId: customer.currentWorkoutId || "",
        },
    });

    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function onSubmit(data: FormData) {
        setLoading(true);

        try {
            const updatedCustomer = await updateCustomerWorkoutByAdmin(customer.id,
                data.currentWorkoutId,
            );
            if (updatedCustomer) {
                toastMessage({
                    message: "Treino do cliente atualizado com sucesso!",
                    type: "success",
                });
                reset();
                setIsEditModalOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            toastMessage({
                message: "Erro ao atualizar treino do cliente!",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleSelectWorkout = (workoutId: string) => {
        setValue("currentWorkoutId", workoutId);
        setIsDialogOpen(false);
    };

    const currentWorkout = workouts.find(w => w.id === getValues("currentWorkoutId"));

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto p-4 shadow-md rounded-lg">
            <div>
                <Label htmlFor="currentWorkoutId" className="font-bold">Treino Atual</Label>
                <div className="mt-1 w-full flex items-center gap-2">
                    <span className="flex-1 p-2 border rounded-md">
                        {currentWorkout ? currentWorkout.name : "Nenhum treino selecionado"}
                    </span>
                    <Button
                        type="button"
                        onClick={() => setIsDialogOpen(true)}
                        variant='secondary'
                    >
                        Selecionar Treino
                    </Button>
                </div>
                {errors.currentWorkoutId && <p className="text-red-500 text-sm">{errors.currentWorkoutId.message}</p>}
            </div>

            <Button
                type="submit"
                className="w-full text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                disabled={loading}
            >
                {loading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                ) : (
                    "Salvar"
                )}
            </Button>

            {isDialogOpen && (
                <WorkoutsDialog
                    isOpen={isDialogOpen}
                    workouts={workouts}
                    selectedWorkoutId={getValues("currentWorkoutId")}
                    onSelectWorkout={handleSelectWorkout}
                    setIsDialogOpen={setIsDialogOpen}
                />
            )}
        </form>
    );
}