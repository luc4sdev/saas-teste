"use client";

import { FaWhatsapp } from "react-icons/fa";
import { Button } from "../ui/button";

export default function SupportButton() {
    const phoneNumber = "5562992894923";
    const message = "Olá! Tenho algumas dúvidas sobre o Aplicativo.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <Button className="w-full md:w-1/3 lg:w-1/5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition-colors">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
            >
                <FaWhatsapp size={20} />
                <span>Falar com Suporte</span>
            </a>
        </Button>
    );
}