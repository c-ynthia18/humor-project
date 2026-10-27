import { createClient } from "@supabase/supabase-js";



export default async function Home() {
  const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: jokes, error } = await supabase
      .from("jokes")
      .select("id, content")
      .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
      <main className="min-h-screen p-10">
        <h1 className="text-3xl font-bold mb-4">
          Hello World!
        </h1>

        <p className="mb-6">
          Here are some jokes from my Supabase database:
        </p>

        <ul className="space-y-4">
          {jokes?.map((joke) => (
              <li
                  key={joke.id}
                  className="border rounded-lg p-4"
              >
                {joke.content}
              </li>
          ))}
        </ul>
      </main>
  );
}