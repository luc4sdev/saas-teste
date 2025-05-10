import { CustomerDataWithEmail } from "@/app/server/get-customer-data";
import { Workout } from "@/app/server/get-workouts-data";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CustomerWorkoutsHistoryDialogProps {
    customer: CustomerDataWithEmail;
    workouts: Workout[];
}

export function CustomerWorkoutsHistoryDialog({ customer, workouts }: CustomerWorkoutsHistoryDialogProps) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Histórico de Treinos de {customer.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
                {customer.workoutsHistory?.length ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Treino</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.workoutsHistory
                                .sort((a, b) => b.date - a.date)
                                .map((historyItem, index) => {
                                    const workout = workouts.find(w => w.id === historyItem.workoutId);
                                    const date = format(historyItem.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{workout?.name || "Treino não encontrado"}</TableCell>
                                            <TableCell>
                                                {date}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center py-4">Nenhum histórico de treinos encontrado.</p>
                )}
            </div>
        </DialogContent>
    );
}