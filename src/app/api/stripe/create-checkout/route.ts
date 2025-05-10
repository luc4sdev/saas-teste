import { auth } from "@/lib/auth"
import { db } from "@/lib/firebase"
import stripe from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    const { metadata, planType } = await req.json()

    let price: string | undefined;
    switch (planType) {
        case "monthly":
            price = process.env.STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID;
            break;
        case "quarterly":
            price = process.env.STRIPE_SUBSCRIPTION_QUARTERLY_PRICE_ID;
            break;
        case "semiannual":
            price = process.env.STRIPE_SUBSCRIPTION_SEMIANNUAL_PRICE_ID;
            break;
        default:
            return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    if (!price) {
        return NextResponse.json({ error: "Price ID not configured" }, { status: 500 });
    }

    const userSession = await auth()
    if (!userSession || !userSession.user?.id || !userSession.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = userSession.user?.id
    const userEmail = userSession.user?.email
    const userName = userSession.user?.name

    const userRef = db.collection("users").doc(userId || "")
    const userDoc = await userRef.get()

    let customerStripeId;
    if (userDoc.exists) {
        customerStripeId = userDoc.data()?.customerStripeId
    }
    if (!customerStripeId) {
        const newCustomer = await stripe.customers.create({
            email: userEmail,
            name: userName || "Sem nome",
            metadata: {
                userId: userId
            }
        })
        customerStripeId = newCustomer.id
        await userRef.update({
            customerStripeId
        })
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerStripeId,
        line_items: [{
            price,
            quantity: 1,
        }],
        mode: "subscription",
        payment_method_types: ["card"],
        success_url: `${req.headers.get("origin")}/${metadata.customerId}`,
        cancel_url: `${req.headers.get("origin")}/${metadata.customerId}`,
        client_reference_id: userId,
        metadata,
    })

    return NextResponse.json({
        sessionId: session.id
    })
}