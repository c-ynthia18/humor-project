import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export const instant = false;

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_path")
        .eq("id", user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return (
        <main className="mx-auto min-h-screen max-w-xl p-10">
            <h1 className="mb-4 text-3xl font-bold">
                My Profile
            </h1>

            <p className="mb-8 text-gray-500">{user.email}</p>

            <ProfileForm
                userId={user.id}
                initialFirstName={profile.first_name}
                initialLastName={profile.last_name}
                initialAvatarPath={profile.avatar_path}
            />
        </main>
    );
}

//Create your Profile page