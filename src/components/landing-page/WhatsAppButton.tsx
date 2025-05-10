"use client";

import { FaWhatsapp } from "react-icons/fa";


export function WhatsAppButton() {
    const phoneNumber = "5562992894923";
    const message = "Olá! Gostaria de saber mais sobre o ClickFlow.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        >
            <FaWhatsapp size={24} />
        </a>
    );
}