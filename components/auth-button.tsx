"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthButton({
                                       mode,
                                   }: {
    mode: "login" | "logout";
}) {
    const router = useRouter();

    async function handleClick() {
        const supabase = createClient();

        if (mode === "login") {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                alert(error.message);
            }
        } else {
            const { error } = await supabase.auth.signOut();

            if (error) {
                alert(error.message);
                return;
            }

            router.replace("/");
            router.refresh();
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
        >
            {mode === "login"
                ? "Sign in with Google"
                : "Sign out"}
        </button>
    );
}

//Implement Google login and logout
