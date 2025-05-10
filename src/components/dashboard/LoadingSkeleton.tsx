import Image from "next/image";

export default function LoadingSkeleton() {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className='transition-al ease-in-out animate-bounce'
            >
                <Image
                    src="/logo-white.png"
                    alt="Carregando..."
                    width={120}
                    height={120}
                    className="w-32 h-w-32 md:w-32 md:h-32 animate-pulse"
                    priority
                />
            </div>
        </div>
    );
}