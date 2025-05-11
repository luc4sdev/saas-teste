"use client";
import { useStripe } from "@/hooks/useStripe";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { CreditCard } from "lucide-react";

export function PortalStripeButton() {
    const { handleCreateStripePortal } = useStripe();

    return <Button className="w-full md:w-1/3 lg:w-1/5" onClick={() => handleCreateStripePortal()}><CreditCard />Gerencie sua assinatura</Button>;
}