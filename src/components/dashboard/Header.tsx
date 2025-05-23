import { LogOut, Target } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { manageAuth } from '@/app/actions/manage-auth';
import { Button } from '../ui/button';

interface HeaderProps {
    userName: string;
    avatarSrc: string;
}

export function Header({ userName, avatarSrc }: HeaderProps) {
    return (
        <header className="flex sm:hidden items-center justify-between p-4 bg-background border-b border-zinc-700">
            <div className="flex items-center gap-4">
                <Target className="text-primary size-8" />
                <span className="text-lg font-bold">ClickFlow</span>
            </div>
            <div className='flex items-center gap-3'>
                <Avatar className="size-8">
                    <AvatarImage src={avatarSrc} alt={userName} />
                    <AvatarFallback>{userName[0]}</AvatarFallback>
                </Avatar>
                <h1 className="hidden sm:block text-sm md:text-lg font-bold truncate">{userName}</h1>
                <form action={manageAuth}>
                    <Button size='sm' variant='destructive'> <LogOut className="w-5 h-5" />Sair</Button>
                </form>
            </div>

        </header>
    );
};