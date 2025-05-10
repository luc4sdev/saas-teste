export function Footer() {
    return (
        <footer className="text-center p-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-base">
                    &copy; {new Date().getFullYear()} ClickFlow. Todos os direitos reservados.
                </p>
                <div className="mt-4 space-x-6">
                    <a
                        href="/terms"
                        className="text-base text-gray-400 hover:text-white"
                    >
                        Termos de Uso
                    </a>
                    <a
                        href="/privacy"
                        className="text-base text-gray-400 hover:text-white"
                    >
                        Política de Privacidade
                    </a>
                </div>
            </div>
        </footer>
    );
}
