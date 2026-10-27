
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthButton from "@/components/auth-button";

export const instant = false;

const secretJokes = [
    {
        question: "Why did the SQL table go to therapy?",
        answer: "It had too many unresolved relationships.",
    },
    {
        question: "Why do programmers prefer dark mode?",
        answer: "Because light attracts bugs!",
    },
    {
        question: "Why did the programmer bring a ladder?",
        answer: "To reach the next level of abstraction.",
    },
    {
        question: "Why was JavaScript invited to the party?",
        answer: "Because it knew how to handle events.",
    },
];

export default async function MembersPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Only authenticated users can view this page.
    if (!user) {
        redirect("/");
    }

    const name = user.user_metadata?.full_name || "Member";

    return (
        <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between gap-4">
          <span className="rounded-full bg-green-950 px-4 py-2 text-sm text-green-300">
            🔐 Members Only
          </span>
                    <AuthButton mode="logout" />
                </div>

                <h1 className="mb-4 text-4xl font-bold">
                    Welcome to the Secret Joke Vault! 🔐
                </h1>

                <p className="mb-2 text-lg text-gray-300">
                    Hey, {name}!
                </p>

                <p className="mb-10 text-gray-400">
                    You've unlocked an exclusive collection of
                    painfully good jokes. Click to reveal the punchlines!
                </p>

                <div className="grid gap-5">
                    {secretJokes.map((joke, index) => (
                        <details
                            key={index}
                            className="rounded-2xl border border-gray-700 bg-gray-900 p-6"
                        >
                            <summary className="cursor-pointer text-lg font-semibold">
                                {joke.question}
                            </summary>

                            <p className="mt-5 border-t border-gray-700 pt-5 text-purple-300">
                                {joke.answer}
                            </p>
                        </details>
                    ))}
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                    <Link
                        href="/profile"
                        className="rounded-lg bg-purple-600 px-5 py-3"
                    >
                        My Profile
                    </Link>

                    <Link
                        href="/"
                        className="rounded-lg border border-gray-600 px-5 py-3"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
//reate the Secret Joke Vault 🔐