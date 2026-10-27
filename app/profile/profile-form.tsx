
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
    userId: string;
    initialFirstName: string | null;
    initialLastName: string | null;
    initialAvatarPath: string | null;
};

export default function ProfileForm({
                                        userId,
                                        initialFirstName,
                                        initialLastName,
                                        initialAvatarPath,
                                    }: Props) {
    const [firstName, setFirstName] = useState(
        initialFirstName ?? ""
    );
    const [lastName, setLastName] = useState(
        initialLastName ?? ""
    );
    const [avatarUrl, setAvatarUrl] =
        useState<string | null>(null);
    const [message, setMessage] = useState("");

    // Load the previously uploaded profile photo.
    useEffect(() => {
        if (!initialAvatarPath) return;

        let active = true;

        async function loadAvatar() {
            const supabase = createClient();

            const { data } = await supabase.storage
                .from("avatars")
                .createSignedUrl(initialAvatarPath!, 3600);

            if (active && data) {
                setAvatarUrl(data.signedUrl);
            }
        }

        void loadAvatar();

        return () => {
            active = false;
        };
    }, [initialAvatarPath]);

    // Save first and last names to the profiles table.
    async function saveProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("Saving...");

        const supabase = createClient();

        const { error } = await supabase
            .from("profiles")
            .update({
                first_name: firstName.trim() || null,
                last_name: lastName.trim() || null,
            })
            .eq("id", userId);

        setMessage(error ? error.message : "Profile saved!");
    }

    // Upload the photo into Supabase Storage.
    async function uploadPhoto(
        e: ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        const extensions: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
        };

        const extension = extensions[file.type];

        if (!extension || file.size > 2 * 1024 * 1024) {
            setMessage("Choose a JPG, PNG, or WebP under 2 MB.");
            return;
        }

        setMessage("Uploading...");

        const supabase = createClient();

        // Each user's image is stored in their own folder.
        const path =
            `${userId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, file, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            setMessage(uploadError.message);
            return;
        }

        // Store only the file path in the relational database.
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ avatar_path: path })
            .eq("id", userId);

        if (updateError) {
            setMessage(updateError.message);
            return;
        }

        const { data, error: urlError } =
            await supabase.storage
                .from("avatars")
                .createSignedUrl(path, 3600);

        if (urlError) {
            setMessage(urlError.message);
            return;
        }

        setAvatarUrl(data.signedUrl);
        setMessage("Photo uploaded!");
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="mb-4 text-xl font-semibold">
                    Profile Photo
                </h2>

                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        className="mb-4 h-28 w-28 rounded-full object-cover"
                    />
                ) : (
                    <p className="mb-4 text-gray-500">
                        No photo uploaded yet.
                    </p>
                )}

                <div className="mt-4">
                    <label
                        htmlFor="avatar-upload"
                        className="inline-block cursor-pointer rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
                    >
                        📷 Upload Profile Photo
                    </label>

                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={uploadPhoto}
                        className="sr-only"
                    />
                </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-5">
                <div>
                    <label htmlFor="firstName" className="mb-2 block">
                        First Name
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-lg border p-3 text-gray-900"
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="mb-2 block">
                        Last Name
                    </label>

                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-lg border p-3 text-gray-900"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-purple-600 px-5 py-3 text-white"
                >
                    Save Profile
                </button>
            </form>

            <p role="status" className="text-sm">{message}</p>
        </div>
    );
}

//This form will let the authenticated user:
// - Update their first name and last name.
// - Upload a profile photo.
// - Save changes directly to Supabase.
// - View their uploaded photo using a temporary signed URL
