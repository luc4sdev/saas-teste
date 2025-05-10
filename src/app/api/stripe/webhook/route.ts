import { db } from "@/lib/firebase"
import stripe from "@/lib/stripe"
import { htmlEmail } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get("stripe-signature")
        const secret = process.env.STRIPE_WEBHOOK_SECRET

        if (!signature || !secret) {
            throw new Error("Stripe webhook secret is not set")
        }

        const event = stripe.webhooks.constructEvent(body, signature, secret)
        switch (event.type) {
            case "checkout.session.completed":
                // usuário completou o checkout
                if (event.data.object.payment_status === 'paid') {
                    const userId = event.data.object.client_reference_id;
                    if (userId) {
                        await db.collection("users").doc(userId).update({
                            isSubscribed: true,
                        });
                    }
                }
                break
            case "customer.subscription.deleted":
                // usuário cancelou a assinatura
                const subscription = event.data.object
                const customerStripeId = subscription.customer as string
                if (customerStripeId) {
                    const customerStripe = await stripe.customers.retrieve(customerStripeId) as Stripe.Customer

                    if (customerStripe && customerStripe.metadata.userId) {
                        const userId = customerStripe.metadata.userId
                        await db.collection("users").doc(userId).update({
                            isSubscribed: false,
                        })
                    }
                }
                break
        }
        return new NextResponse(null, { status: 200 })

    } catch (error) {
        return new NextResponse(null, { status: 500 })
    }


}