import { Home, LogOut, Target } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth";
import { manageAuth } from "@/app/actions/manage-auth";
import Link from "next/link";
import Image from "next/image";

export async function Header() {
    const session = await auth()

    return (
        <div className="max-w-7xl mx-auto flex items-center justify-between p-5 sm:p-10">
            <div className="flex items-center gap-4">
                <Target className="text-primary size-10" />
                <span className="text-lg font-bold">ClickFlow</span>
            </div>
            <div className="flex items-center gap-4">
                {session && <Link href='/create'><Button><Home className="w-5 h-5" /><span className="hidden sm:block">Dashboard</span></Button></Link>}
                <form action={manageAuth}>
                    <Button variant={session ? 'destructive' : 'default'}>{session && <LogOut className="w-5 h-5" />}{session ? <span className="hidden sm:block">Sair</span> :
                        <span className="flex justify-center items-center gap-2">
                            <Image src='/google.png' alt="Google Login" width={25} height={25} />
                            Login
                        </span>
                    }</Button>
                </form>
            </div>
        </div>
    )
}