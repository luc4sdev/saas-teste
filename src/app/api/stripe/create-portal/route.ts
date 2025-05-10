import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { metadata } = await req.json()
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await db.collection("users").doc(userId).get();
    const customerStripeId = user.data()?.customerStripeId;
    if (!customerStripeId) {
        return NextResponse.json({ error: "Customer Stripe not found" }, { status: 404 });
    }
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerStripeId,
            return_url: `${req.headers.get("origin")}/${metadata.customerId}`,
        });
        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}