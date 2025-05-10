import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";


export function useStripe() {
    const [stripe, setStripe] = useState<Stripe | null>(null)

    useEffect(() => {
        async function loadStripeAsync() {
            const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
            setStripe(stripeInstance)
        }
        loadStripeAsync()
    }, [])

    async function createStripeCheckout({
        metadata,
        planType
    }: {
        metadata: any,
        planType: "monthly" | "quarterly" | "semiannual";
    }) {
        try {
            const response = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ metadata, planType })
            })
            const data = await response.json()

            await stripe?.redirectToCheckout({
                sessionId: data.sessionId
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreateStripePortal({
        metadata,
    }: {
        metadata: any,
    }) {
        const response = await fetch("/api/stripe/create-portal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ metadata })
        });
        const data = await response.json();
        window.location.href = data.url;
    }
    return { createStripeCheckout, handleCreateStripePortal };
}