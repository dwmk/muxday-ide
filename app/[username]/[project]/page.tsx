"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Split from "react-split"; // You might need a wrapper for NextJS
import CodeEditor from "@/components/ide/CodeEditor";
import PreviewWindow from "@/components/ide/PreviewWindow";
import { Save, Eye, Smartphone, Monitor } from "lucide-react";

export default function ProjectIDE() {
  const params = useParams();
  const supabase = createClient();
  
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [mobileEditorTab, setMobileEditorTab] = useState<"html" | "css" | "js">("html");

  // Load Project
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, profiles!inner(username)")
        .eq("slug", params.project)
        .eq("profiles.username", params.username)
        .single();

      if (data) {
        setHtml(data.html_code);
        setCss(data.css_code);
        setJs(data.js_code);
        // Increment View
        await supabase.rpc("increment_view_count", { project_id: data.id });
      }
    };
    fetchProject();
  }, [params, supabase]);

  const handleSave = async () => {
     // Implementation for saving (requires auth check)
     alert("Save functionality placeholder");
  };

  return (
    <div className="flex h-screen flex-col bg-dark-900">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-dark-900 bg-dark-800 px-4">
        <div className="flex items-center gap-2">
           <span className="font-bold text-blurple">MuxDay</span>
           <span className="text-gray-500">/</span>
           <span className="text-sm font-medium">{params.project}</span>
        </div>
        <div className="flex gap-2">
           <button onClick={handleSave} className="flex items-center gap-2 rounded bg-blurple px-3 py-1.5 text-xs font-bold hover:bg-blurple-hover">
             <Save size={14} /> Save
           </button>
        </div>
      </header>

      {/* Desktop Layout (Split Pane) */}
      <div className="hidden h-[calc(100vh-56px)] md:block">
        <Split 
            sizes={[50, 50]} 
            minSize={100} 
            expandToMin={false} 
            gutterSize={10} 
            gutterAlign="center" 
            snapOffset={30} 
            dragInterval={1} 
            direction="horizontal"
            cursor="col-resize"
            className="flex h-full"
        >
            <div className="flex h-full flex-col">
                 <div className="h-1/3 border-b border-dark-900"><CodeEditor language="html" value={html} onChange={(v) => setHtml(v || "")} /></div>
                 <div className="h-1/3 border-b border-dark-900"><CodeEditor language="css" value={css} onChange={(v) => setCss(v || "")} /></div>
                 <div className="h-1/3"><CodeEditor language="javascript" value={js} onChange={(v) => setJs(v || "")} /></div>
            </div>
            <div className="h-full bg-white">
                <PreviewWindow html={html} css={css} js={js} />
            </div>
        </Split>
      </div>

      {/* Mobile Layout (Tabs) */}
      <div className="block h-[calc(100vh-56px)] md:hidden">
        <div className="flex h-10 border-b border-dark-900 bg-dark-800">
          <button onClick={() => setActiveTab("code")} className={`flex-1 text-sm font-bold ${activeTab === "code" ? "text-blurple border-b-2 border-blurple" : "text-gray-400"}`}>Code</button>
          <button onClick={() => setActiveTab("preview")} className={`flex-1 text-sm font-bold ${activeTab === "preview" ? "text-blurple border-b-2 border-blurple" : "text-gray-400"}`}>Preview</button>
        </div>

        {activeTab === "code" ? (
          <div className="flex h-[calc(100%-40px)] flex-col">
             <div className="flex h-8 bg-dark-900">
               {["html", "css", "js"].map((lang) => (
                 <button 
                    key={lang}
                    onClick={() => setMobileEditorTab(lang as any)}
                    className={`px-4 text-xs font-bold uppercase ${mobileEditorTab === lang ? "bg-dark-700 text-white" : "text-gray-500"}`}
                 >
                   {lang}
                 </button>
               ))}
             </div>
             <div className="flex-1">
               {mobileEditorTab === "html" && <CodeEditor language="html" value={html} onChange={(v) => setHtml(v || "")} />}
               {mobileEditorTab === "css" && <CodeEditor language="css" value={css} onChange={(v) => setCss(v || "")} />}
               {mobileEditorTab === "js" && <CodeEditor language="javascript" value={js} onChange={(v) => setJs(v || "")} />}
             </div>
          </div>
        ) : (
          <PreviewWindow html={html} css={css} js={js} />
        )}
      </div>
    </div>
  );
}