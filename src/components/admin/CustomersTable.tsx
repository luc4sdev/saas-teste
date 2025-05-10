"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerDataWithEmail } from "@/app/server/get-customer-data";
import { EditCustomerWorkoutForm } from "./EditCustomerWorkoutForm";
import { Workout } from "@/app/server/get-workouts-data";
import { translateCategory, translateGender, translateGoal } from "@/lib/utils";
import { CustomerWorkoutsHistoryDialog } from "./CustomerWorkoutsHistoryDialog";

interface CustomersTableProps {
    customers: CustomerDataWithEmail[];
    workouts: Workout[];
}

export function CustomersTable({ customers, workouts }: CustomersTableProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerDataWithEmail | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [viewingHistoryCustomer, setViewingHistoryCustomer] = useState<CustomerDataWithEmail | null>(null);

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Peso (kg)</TableHead>
                        <TableHead>Objetivo</TableHead>
                        <TableHead>Foco muscular</TableHead>
                        <TableHead>Tempo de treino</TableHead>
                        <TableHead>Frequência semanal</TableHead>
                        <TableHead>Treino</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{translateGender(customer.gender)}</TableCell>
                            <TableCell>{customer.age}</TableCell>
                            <TableCell>{customer.weight}</TableCell>
                            <TableCell>{translateGoal(customer.goal)}</TableCell>
                            <TableCell>{customer.muscleFocus !== 'general' ? translateCategory(customer.muscleFocus) : 'Geral'}</TableCell>
                            <TableCell>{customer.trainingTime} meses</TableCell>
                            <TableCell>{customer.weeklyFrequency}</TableCell>
                            <TableCell>{workouts.find(workout => customer.currentWorkoutId === workout.id)?.name}</TableCell>

                            <TableCell className="flex gap-5">

                                <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setViewingHistoryCustomer(customer);
                                                setIsHistoryModalOpen(true);
                                            }}
                                        >
                                            Histórico
                                        </Button>
                                    </DialogTrigger>
                                    {viewingHistoryCustomer && (
                                        <CustomerWorkoutsHistoryDialog
                                            customer={viewingHistoryCustomer}
                                            workouts={workouts}
                                        />
                                    )}
                                </Dialog>

                                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingCustomer(customer);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            Editar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Treino</DialogTitle>
                                        </DialogHeader>
                                        {editingCustomer && (
                                            <EditCustomerWorkoutForm
                                                customer={editingCustomer}
                                                workouts={workouts}
                                                setIsEditModalOpen={setIsEditModalOpen}
                                            />
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}