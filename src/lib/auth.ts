import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import { db, firebaseCert } from "./firebase";
import Google from "next-auth/providers/google";
import { Timestamp } from "firebase-admin/firestore";

declare module "next-auth" {
    interface Session {
        user: {
            createdAt: number;
        } & DefaultSession["user"]
    }
    interface User {
        createdAt: number;
        isSubscribed?: boolean;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: FirestoreAdapter({
        credential: firebaseCert,
    }),
    providers: [Google],
    events: {
        createUser: async ({ user }) => {
            if (!user.id) return;
            await db.collection("users").doc(user.id).update({
                createdAt: Timestamp.now().toMillis()
            })
        }
    },
    callbacks: {
        session({
            session,
        }) {
            return {
                ...session,
                user: {
                    ...session.user,
                }
            }
        }
    }
})