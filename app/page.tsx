
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthButton from "@/components/auth-button";

export const instant = false;

export default async function Home() {
    const supabase = await createClient();

    const { data: jokes, error } = await supabase
        .from("jokes")
        .select("id, content")
        .order("id", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return (
        <main className="min-h-screen bg-gray-50 p-10 text-gray-900">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-3 text-4xl font-bold">
                    Hello World! 👋
                </h1>

                <h2 className="mb-4 text-2xl font-semibold">
                    Welcome to Humor Project
                </h2>

                <p className="mb-6 text-gray-600">
                    Here are some jokes from my Supabase database.
                </p>

                <div className="mb-10 flex flex-wrap gap-4">
                    <AuthButton mode="login" />

                    <Link
                        href="/members"
                        className="rounded-lg bg-gray-900 px-5 py-3 text-white"
                    >
                        Secret Joke Vault 🔐
                    </Link>

                    <Link
                        href="/profile"
                        className="rounded-lg border border-gray-300 px-5 py-3"
                    >
                        My Profile
                    </Link>
                </div>

                <h3 className="mb-4 text-xl font-semibold">
                    Public Jokes
                </h3>

                <ul className="space-y-4">
                    {jokes?.map((joke) => (
                        <li
                            key={joke.id}
                            className="rounded-xl border border-gray-200 bg-white p-5"
                        >
                            {joke.content}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
