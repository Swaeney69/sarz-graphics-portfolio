"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { portfolioData } from "@/data/portfolio";
import { Plus, Trash2, Edit2, Sparkles, LogOut, Save, X, ExternalLink, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    if (!currentProject.title || !currentProject.type) {
      alert("Please fill in title and type before generating description");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentProject.title,
          type: currentProject.type,
          tools: currentProject.tools || [],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to generate description");
      }

      const data = await response.json();
      setCurrentProject({
        ...currentProject,
        description: data.description,
        details: data.details,
      });
    } catch (error) {
      alert(
        `Error generating description: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your portfolio projects</p>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => {
                  setCurrentProject({ tools: [] });
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-border bg-background px-4 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-sm"
              >
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Live Site
          </button>
          <span className="text-xs text-muted-foreground">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

      {isEditing ? (
        <div className="bg-card border border-border rounded-lg p-6 shadow-md max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold">
              {currentProject.id ? "✎ Edit Project" : "✚ Add New Project"}
            </h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-muted rounded-lg transition-colors" title="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground/80">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Project Title *</label>
                  <input
                    id="title"
                    value={currentProject.title || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Project Type *</label>
                  <input
                    id="type"
                    value={currentProject.type || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, type: e.target.value })}
                    className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. Brand Identity"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground/80">Visual & Tools</h3>
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Image URL (optional)</label>
                <input
                  id="image"
                  value={currentProject.image || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                  className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. /projects/my-project.jpg"
                />
                {currentProject.image && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Preview will display at: {currentProject.image}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="tools" className="text-sm font-medium">Tools & Technologies</label>
                <input
                  id="tools"
                  value={Array.isArray(currentProject.tools) ? currentProject.tools.join(", ") : ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, tools: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                  className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Figma, Illustrator, React..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-foreground/80">Description</h3>
                <button
                  onClick={generateDescription}
                  disabled={aiLoading || !currentProject.title || !currentProject.type}
                  className="text-xs font-medium flex items-center gap-1 text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {aiLoading ? "Generating..." : "AI Generate"}
                </button>
              </div>
              <textarea
                value={currentProject.description || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                placeholder="Brief overview of the project..."
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-sm text-foreground/80">Project Details (Problem, Approach, Outcome)</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="problem" className="text-sm font-medium">Problem</label>
                  <textarea
                    id="problem"
                    value={currentProject.details?.problem || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, details: { ...currentProject.details!, problem: e.target.value } })}
                    className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-16 resize-none"
                    placeholder="What challenge did you solve?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="approach" className="text-sm font-medium">Approach</label>
                  <textarea
                    id="approach"
                    value={currentProject.details?.approach || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, details: { ...currentProject.details!, approach: e.target.value } })}
                    className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-16 resize-none"
                    placeholder="How did you approach it?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="outcome" className="text-sm font-medium">Outcome</label>
                  <textarea
                    id="outcome"
                    value={currentProject.details?.outcome || ""}
                    onChange={(e) => setCurrentProject({ ...currentProject, details: { ...currentProject.details!, outcome: e.target.value } })}
                    className="w-full border border-border rounded-lg p-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 h-16 resize-none"
                    placeholder="What were the results?"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!currentProject.title || !currentProject.type}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" /> {currentProject.id ? "Update" : "Create"} Project
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No projects yet. Click "Add Project" to get started!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="group bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-primary/50">
                <div className="aspect-video w-full bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                  {project.image && project.image.startsWith('/') ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      priority={false}
                      loading="lazy"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log("[v0] Admin card image error:", project.image);
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col justify-between h-48">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2 flex-1">{project.title}</h3>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
                        {project.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.tools.slice(0, 2).map(t => (
                        <span key={t} className="text-xs font-medium bg-muted/50 text-muted-foreground px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                      {project.tools.length > 2 && (
                        <span className="text-xs font-medium text-muted-foreground px-2 py-0.5">
                          +{project.tools.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end border-t pt-3 mt-2">
                    <button
                      onClick={() => {
                        setCurrentProject(project);
                        setIsEditing(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 rounded-md transition-colors"
                      title="Edit project"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>
    </div>
  );
}
