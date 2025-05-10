"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toastMessage } from '@/lib/utils';
import { Exercise } from '@/app/server/get-exercises-data';
import { updateExercise } from '@/app/actions/update-exercise';
import { useRouter } from 'next/navigation';
import { Textarea } from '../ui/textarea';


const enumCategory = z.enum(['chest', 'arms', 'shoulders', 'back', 'lower', 'quadriceps', 'glutes', 'hamstrings', 'mobility', 'correction', 'strengthening'])

const formSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    category: enumCategory,
    videoUrl: z.string().url().min(1, 'URL é obrigatória'),
    description: z.string().default(''),
});

type EnumCategory = z.infer<typeof enumCategory>;
type FormData = z.infer<typeof formSchema>;

interface EditExerciseFormProps {
    exercise: Exercise;
    setIsEditModalOpen: (editModalOpen: boolean) => void;
}

export function EditExerciseForm({ exercise, setIsEditModalOpen }: EditExerciseFormProps) {
    const router = useRouter();
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: exercise.name,
            category: exercise.category,
            videoUrl: exercise.videoUrl,
            description: exercise.description
        }
    });

    const [loading, setLoading] = useState(false);


    async function onSubmit(data: FormData) {
        setLoading(true);

        try {
            const updatedExercise = await updateExercise(exercise.id, {
                name: data.name,
                category: data.category,
                videoUrl: data.videoUrl,
                description: data.description
            });;
            if (updatedExercise) {
                toastMessage({
                    message: 'Exercício atualizado com sucesso!',
                    type: 'success'
                })
                reset();
                setIsEditModalOpen(false)
                router.refresh();
            }

        } catch (error) {
            console.error("Erro ao atualizar exercicio:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto p-4 shadow-md rounded-lg">
            <div>
                <Label htmlFor='name' className="font-bold">Nome</Label>
                <Input {...register("name")} className="mt-1 w-full" disabled={loading} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>


            <div>
                <Label htmlFor='Category' className="font-bold">Categoria</Label>
                <Select onValueChange={(value) => setValue("category", value as EnumCategory)} defaultValue={getValues("category")}>
                    <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="chest">Peito</SelectItem>
                        <SelectItem value="arms">Braços</SelectItem>
                        <SelectItem value="shoulders">Ombros</SelectItem>
                        <SelectItem value="back">Costas</SelectItem>
                        <SelectItem value="lower">Inferiores</SelectItem>
                        <SelectItem value="quadriceps">Quadríceps</SelectItem>
                        <SelectItem value="glutes">Glúteos</SelectItem>
                        <SelectItem value="hamstrings">Posteriores</SelectItem>
                        <SelectItem value="mobility">Mobilidade</SelectItem>
                        <SelectItem value="correction">Correção Postural</SelectItem>
                        <SelectItem value="strengthening">Fortalecimento</SelectItem>
                    </SelectContent>
                </Select>

                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div>
                <Label htmlFor='videoUrl' className="font-bold">URL do youtube</Label>
                <Input {...register("videoUrl")} className="mt-1 w-full" disabled={loading} />
                {errors.videoUrl && <p className="text-red-500 text-sm">{errors.videoUrl.message}</p>}
            </div>

            <div>
                <Label htmlFor='description' className="font-bold">Descrição</Label>
                <Textarea placeholder="Insira uma descrição..." {...register("description")} className="mt-1 w-full" disabled={loading} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
