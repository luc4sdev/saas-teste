"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { createExercise } from '@/app/actions/create-exercise';
import { toastMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

const enumCategory = z.enum(['chest', 'arms', 'shoulders', 'back', 'lower', 'quadriceps', 'glutes', 'hamstrings', 'mobility', 'correction', 'strengthening'])

const formSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    category: enumCategory,
    videoUrl: z.string().url().min(1, 'URL é obrigatória'),
    description: z.string().default(''),
});

export type EnumCategory = z.infer<typeof enumCategory>;
type FormData = z.infer<typeof formSchema>;

export function CreateExerciseForm() {
    const router = useRouter();
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function onSubmit(data: FormData) {
        setLoading(true);

        try {
            const exercise = await createExercise(data);
            if (exercise) {
                toastMessage({
                    message: 'Exercício criado com sucesso!',
                    type: 'success'
                })
                reset();
                router.refresh();
            }

        } catch (error) {
            console.error("Erro ao criar exercicio:", error);
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Criar Exercício
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger />
                <DialogContent>
                    <DialogTitle>Crie o exercício</DialogTitle>
                    <DialogDescription>
                        Preencha as informações abaixo para criar um novo exercício.
                    </DialogDescription>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto p-4 shadow-md rounded-lg">
                        <div>
                            <Label htmlFor='name' className="font-bold">Nome</Label>
                            <Input {...register("name")} className="mt-1 w-full" disabled={loading} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor='Category' className="font-bold">Categoria</Label>
                            <Select onValueChange={(value) => setValue("category", value as EnumCategory)} value={getValues("category")}>
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
                            ) : "Criar exercício"}
                        </Button>

                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
