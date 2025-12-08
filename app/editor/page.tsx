// app/editor/[id]/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Editor from "@/components/editor/editor";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editor • MuxDay",
};

export default async function EditorPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Only fetch project if it's not "new"
  let project = null;
  if (params.id !== "new") {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      notFound();
    }

    project = data;
  }

  return <Editor project={project} userId={user.id} />;
}
