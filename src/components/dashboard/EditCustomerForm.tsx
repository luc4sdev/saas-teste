"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { updateCustomer } from '@/app/actions/update-customer';
import { CustomerData } from '@/app/server/get-customer-data';
import { toastMessage } from '@/lib/utils';

const enumGoal = z.enum(['hypertrophy', 'weightLoss'], {
    required_error: 'Selecione o objetivo',
    invalid_type_error: 'Selecione o objetivo',
})
const enumTrainingTime = z.enum(['0-2', '2-6', '6-12', '12-17', '17+'], {
    required_error: 'Selecione o tempo de treino',
    invalid_type_error: 'Selecione o tempo de treino',
})
const enumWeeklyFrequency = z.enum(['2x', '3x', '5x+'], {
    required_error: 'Selecione a frequência semanal',
    invalid_type_error: 'Selecione a frequência semanal',
})
const enumMuscleFocus = z.enum(['general', 'chest', 'arms', 'shoulders', 'back', 'lower', 'quadriceps', 'glutes', 'hamstrings'], {
    required_error: 'Selecione o foco muscular',
    invalid_type_error: 'Selecione o foco muscular',
}).default("general")

const formSchema = z.object({
    age: z.coerce.number({ message: "Insira uma idade válida" }).min(1, 'Idade é obrigatória').max(120, 'Idade inválida'),
    weight: z.coerce.number({ message: "Insira um peso válido" }).min(1, 'Peso é obrigatório'),
    goal: enumGoal,
    trainingTime: enumTrainingTime,
    weeklyFrequency: enumWeeklyFrequency,
    muscleFocus: enumMuscleFocus,
});

type EnumGoal = z.infer<typeof enumGoal>;
type EnumTrainingTime = z.infer<typeof enumTrainingTime>;
type EnumWeeklyFrequency = z.infer<typeof enumWeeklyFrequency>;
type EnumMuscleFocus = z.infer<typeof enumMuscleFocus>;
export type EditCustomerSchema = z.infer<typeof formSchema>;

interface EditCustomerFormProps {
    customer: CustomerData;
}
export function EditCustomerForm({ customer }: EditCustomerFormProps) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EditCustomerSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: customer.age,
            weight: customer.weight,
            goal: customer.goal,
            trainingTime: customer.trainingTime,
            weeklyFrequency: customer.weeklyFrequency,
            muscleFocus: customer.muscleFocus,
        }
    });
    const weeklyFrequency = watch("weeklyFrequency");
    const goal = watch("goal");
    const trainingTime = watch("trainingTime");
    const muscleFocus = watch("muscleFocus");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (weeklyFrequency !== "5x+" || trainingTime !== '17+') {
            setValue("muscleFocus", "general");
        }
    }, [weeklyFrequency, trainingTime, setValue]);

    async function onSubmit(data: EditCustomerSchema) {
        setLoading(true);

        try {
            if (customer) {
                const updatedCustomer = await updateCustomer(customer.id, data);
                if (updatedCustomer) {
                    toastMessage({
                        message: 'Informações atualizadas com sucesso!',
                        type: 'success'
                    })
                    reset();
                    router.push(`/${customer.id}`);
                }
            }

        } catch (error) {
            toastMessage({
                message: 'Erro ao atualizar informações, tente novamente mais tarde!',
                type: 'error'
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto p-4 shadow-md rounded-lg">
            <div>
                <Label htmlFor='age' className="font-bold">Idade</Label>
                <Input {...register("age")} className="mt-1 w-full" disabled={loading} />
                {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <div>
                <Label htmlFor='weight' className="font-bold">Peso (kg)</Label>
                <Input {...register("weight")} className="mt-1 w-full" disabled={loading} />
                {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
            </div>

            <div>
                <Label htmlFor='goal' className="font-bold">Objetivo</Label>
                <Select onValueChange={(value) => setValue("goal", value as EnumGoal)} value={goal} disabled={loading}>
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Selecione um objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
                        <SelectItem value="weightLoss">Emagrecimento</SelectItem>
                    </SelectContent>
                </Select>
                {errors.goal && <p className="text-red-500 text-sm">{errors.goal.message}</p>}
            </div>

            <div>

                <Label htmlFor='trainingTime' className="font-bold">Tempo de Treino (meses)</Label>
                <Select onValueChange={(value) => setValue("trainingTime", value as EnumTrainingTime)} value={trainingTime} disabled={loading}>
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Selecione o tempo de treino" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0-2">0-2 meses</SelectItem>
                        <SelectItem value="2-6">2-6 meses</SelectItem>
                        <SelectItem value="6-12">6-12 meses</SelectItem>
                        <SelectItem value="12-17">12-17 meses</SelectItem>
                        <SelectItem value="17+">17+ meses</SelectItem>
                    </SelectContent>
                </Select>

                {errors.trainingTime && <p className="text-red-500 text-sm">{errors.trainingTime.message}</p>}
            </div>

            <div>


                <Label htmlFor='weeklyFrequency' className="font-bold">Frequência Semanal</Label>
                <Select onValueChange={(value) => setValue("weeklyFrequency", value as EnumWeeklyFrequency)} value={weeklyFrequency} disabled={loading}>
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Selecione a frequência semanal" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2x">2x por semana</SelectItem>
                        <SelectItem value="3x">3x por semana</SelectItem>
                        <SelectItem value="5x+">5x+ por semana</SelectItem>
                    </SelectContent>
                </Select>

                {errors.weeklyFrequency && <p className="text-red-500 text-sm">{errors.weeklyFrequency.message}</p>}
            </div>

            <div>
                <Label htmlFor='muscleFocus' className="font-bold">Foco Muscular</Label>
                <Select disabled={weeklyFrequency !== "5x+" || trainingTime !== '17+'} onValueChange={(value) => setValue("muscleFocus", value as EnumMuscleFocus)} value={muscleFocus}>
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Selecione o foco muscular" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="general">Geral</SelectItem>
                        <SelectItem value="chest">Peito</SelectItem>
                        <SelectItem value="arms">Braços</SelectItem>
                        <SelectItem value="shoulders">Ombros</SelectItem>
                        <SelectItem value="back">Costas</SelectItem>
                        <SelectItem value="lower">Inferiores</SelectItem>
                        <SelectItem value="quadriceps">Quadríceps</SelectItem>
                        <SelectItem value="glutes">Glúteos</SelectItem>
                        <SelectItem value="hamstrings">Posteriores</SelectItem>
                    </SelectContent>
                </Select>

                {errors.muscleFocus && <p className="text-red-500 text-sm">{errors.muscleFocus.message}</p>}
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                disabled={loading}
            >
                {loading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                ) : "Enviar"}
            </Button>
        </form>
    );
};