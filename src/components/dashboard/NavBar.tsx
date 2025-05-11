"use client";
import { Settings, User, LogOut, Home, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { manageAuth } from "@/app/actions/manage-auth";

interface NavBarProps {
    userName: string;
    avatarSrc: string;
}

export default function Navbar({ userName, avatarSrc }: NavBarProps) {
    const pathname = usePathname();

    const menuItems = [
        {
            href: `/dashboard`,
            icon: <Home className="w-5 h-5" />,
            label: "Dashboard"
        },
        {
            href: `/dashboard/settings`,
            icon: <Settings className="w-5 h-5" />,
            label: "Configurações",
        },
    ];

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-2 border-gray-200 sm:hidden z-50">
                <div className="flex justify-around p-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center p-2 rounded-lg ${pathname === item.href
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground"
                                }`}
                        >
                            {item.icon}
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <nav className="hidden sm:flex sm:flex-col sm:w-64 sm:h-screen sm:border-r sm:border-gray-200 sm:bg-background sm:fixed sm:left-0 sm:top-0 sm:z-50">
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-full flex justify-center items-center gap-2">
                            <Target className="text-primary size-10" />
                            <span className="text-lg font-bold">ClickFlow</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center p-2 rounded-lg ${pathname === item.href
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:bg-secondary"
                                    }`}
                            >
                                {item.icon}
                                <span className="ml-2">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-auto p-4">
                    <div className='flex items-center gap-3 mb-3'>
                        <Avatar className="size-8">
                            <AvatarImage src={avatarSrc} alt={userName} />
                            <AvatarFallback>{userName[0]}</AvatarFallback>
                        </Avatar>
                        <h1 className="hidden sm:block text-sm md:text-lg font-bold truncate">{userName}</h1>

                    </div>
                    <form action={manageAuth}>
                        <Button variant="ghost" className="w-full justify-start">
                            <LogOut className="w-5 h-5 mr-2" />
                            Sair
                        </Button>
                    </form>
                </div>
            </nav>
        </>
    );
}