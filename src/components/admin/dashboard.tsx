"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { portfolioData } from "@/data/portfolio";
import { Plus, Trash2, Edit2, Sparkles, LogOut, Save, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = typeof portfolioData.projects[0];

export function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [aiLoading, setAiLoading] = useState(false);

  // Load projects from localStorage or fallback to initial data
  useEffect(() => {
    const savedProjects = localStorage.getItem("portfolio_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(portfolioData.projects);
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("portfolio_projects", JSON.stringify(projects));
    }
  }, [projects]);

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  const handleSave = () => {
    if (!currentProject.title) return;

    if (currentProject.id) {
      // Edit existing
      setProjects(projects.map(p => p.id === currentProject.id ? { ...p, ...currentProject } as Project : p));
    } else {
      // Add new
      const newProject = {
        ...currentProject,
        id: Date.now().toString(),
        image: "/placeholder-project-new.jpg", // Default image
        details: currentProject.details || {
            problem: "Description pending...",
            approach: "Description pending...",
            outcome: "Description pending..."
        }
      } as Project;
      setProjects([...projects, newProject]);
    }
    setIsEditing(false);
    setCurrentProject({});
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const generateDescription = async () => {
    setAiLoading(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const type = currentProject.type || "Design";
    const tools = Array.isArray(currentProject.tools) ? currentProject.tools.join(", ") : currentProject.tools;
    const title = currentProject.title || "Project";

    const aiDescription = `Designed a comprehensive ${type} solution for ${title} using ${tools}. The goal was to create a user-centric experience that drives engagement and communicates brand values effectively.`;
    
    const aiDetails = {
      problem: `The client faced challenges with brand inconsistency and low user engagement in their previous ${type} implementation.`,
      approach: `Leveraged ${tools} to create a modular design system. Focused on clean typography, intuitive navigation, and accessible color palettes.`,
      outcome: `Achieved a 30% increase in user retention and received positive feedback on the new visual direction.`
    };

    setCurrentProject({
      ...currentProject,
      description: aiDescription,
      details: aiDetails
    });
    setAiLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentProject({ tools: [] });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Project
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border bg-background px-4 py-2 rounded-md hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="mb-6">
        <button 
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
            View Live Site <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {isEditing ? (
        <div className="bg-card border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {currentProject.id ? "Edit Project" : "New Project"}
            </h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-accent rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  value={currentProject.title || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  className="w-full border rounded-md p-2 bg-background"
                  placeholder="Project Title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <input
                  value={currentProject.type || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, type: e.target.value })}
                  className="w-full border rounded-md p-2 bg-background"
                  placeholder="e.g. UI Design"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <input
                value={currentProject.image || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                className="w-full border rounded-md p-2 bg-background"
                placeholder="/placeholder-project-1.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tools (comma separated)</label>
              <input
                value={Array.isArray(currentProject.tools) ? currentProject.tools.join(", ") : ""}
                onChange={(e) => setCurrentProject({ ...currentProject, tools: e.target.value.split(",").map(t => t.trim()) })}
                className="w-full border rounded-md p-2 bg-background"
                placeholder="Figma, React, etc."
              />
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Short Brief / Description</label>
                  <button
                    onClick={generateDescription}
                    disabled={aiLoading}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" />
                    {aiLoading ? "Generating..." : "Generate with AI"}
                  </button>
               </div>
              <textarea
                value={currentProject.description || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full border rounded-md p-2 bg-background h-24"
                placeholder="Brief description..."
              />
            </div>

            <div className="border-t pt-4 space-y-4">
               <h3 className="font-medium">Project Details</h3>
               <div className="space-y-2">
                <label className="text-sm font-medium">Problem</label>
                <textarea
                  value={currentProject.details?.problem || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, details: { ...currentProject.details!, problem: e.target.value } })}
                  className="w-full border rounded-md p-2 bg-background h-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Approach</label>
                <textarea
                  value={currentProject.details?.approach || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, details: { ...currentProject.details!, approach: e.target.value } })}
                  className="w-full border rounded-md p-2 bg-background h-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Outcome</label>
                <textarea
                  value={currentProject.details?.outcome || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, details: { ...currentProject.details!, outcome: e.target.value } })}
                  className="w-full border rounded-md p-2 bg-background h-20"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
              >
                <Save className="h-4 w-4" /> Save Project
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg">{project.title}</h3>
                   <span className="text-xs bg-muted px-2 py-1 rounded">{project.type}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tools.slice(0, 3).map(t => (
                    <span key={t} className="text-xs border px-1 rounded">{t}</span>
                  ))}
                  {project.tools.length > 3 && <span className="text-xs text-muted-foreground">+{project.tools.length - 3}</span>}
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t pt-4">
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    setIsEditing(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
