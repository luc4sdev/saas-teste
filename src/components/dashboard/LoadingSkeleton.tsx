import { Target } from "lucide-react";

export default function LoadingSkeleton() {

    return (
        <div className="h-screen flex items-center justify-center">
            <div
                className='transition-al ease-in-out animate-bounce'
            >
                <Target className="text-primary size-52" />
            </div>
        </div>
    );
}