import { getCustomersData } from "@/app/server/get-customer-data";
import { getWorkoutsData } from "@/app/server/get-workouts-data";
import { CustomersTable } from "@/components/admin/CustomersTable";


export default async function Customers() {
    const customers = await getCustomersData()
    const workouts = await getWorkoutsData()
    return (
        <div className="flex flex-col justify-center items-center p-10">
            <h1 className="mb-5 font-bold text-2xl">Usuários</h1>
            {customers.length > 0 && <CustomersTable customers={customers} workouts={workouts} />}
        </div>
    )
}