import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Code, BadgeCheck } from "lucide-react";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient();
  
  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!profile) return <div className="p-10 text-center">User not found</div>;

  // Fetch Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const socials = profile.socials as any;

  return (
    <div className="min-h-screen bg-dark-700">
      {/* Banner */}
      <div className="h-48 w-full bg-blurple/20 relative overflow-hidden">
        {profile.banner_url && (
           <Image src={profile.banner_url} alt="Banner" fill className="object-cover opacity-80" />
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10">
        <div className="relative -mt-16 mb-6 flex flex-col items-center md:flex-row md:items-end md:gap-6">
          {/* Avatar */}
          <div className="relative h-32 w-32 rounded-full border-4 border-dark-700 bg-dark-800">
             <Image 
               src={profile.avatar_url || "https://github.com/shadcn.png"} 
               alt={profile.username} 
               fill 
               className="rounded-full object-cover"
             />
          </div>
          
          <div className="mb-2 flex-1 text-center md:text-left">
            <h1 className="flex items-center justify-center gap-2 text-3xl font-bold text-white md:justify-start">
              {profile.display_name || profile.username}
              {profile.is_verified && <BadgeCheck className="text-blurple" />}
            </h1>
            <p className="text-gray-400">@{profile.username}</p>
          </div>

          {/* Socials */}
          <div className="flex gap-3 text-gray-400">
             {socials?.github && <Link href={socials.github}><Github className="hover:text-white" /></Link>}
             {socials?.linkedin && <Link href={socials.linkedin}><Linkedin className="hover:text-white" /></Link>}
             {/* Add more icons as needed */}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10 rounded-lg bg-dark-800 p-6 shadow-sm">
           <h3 className="mb-2 text-xs font-bold uppercase text-gray-500">About</h3>
           <p className="text-gray-200">{profile.bio || "No bio yet."}</p>
        </div>

        {/* Projects Grid */}
        <h2 className="mb-4 text-xl font-bold text-white">Public Muxes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((proj) => (
            <Link key={proj.id} href={`/${profile.username}/${proj.slug}`}>
              <div className="group overflow-hidden rounded-lg bg-dark-800 transition hover:ring-2 hover:ring-blurple">
                <div className="flex h-40 items-center justify-center bg-dark-900 text-dark-600">
                  <Code size={40} />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white group-hover:text-blurple">{proj.title}</h3>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                    <span>{proj.views_count} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}