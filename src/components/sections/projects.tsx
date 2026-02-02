"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<(typeof portfolioData.projects)[0] | null>(null);
  const [projects, setProjects] = useState(portfolioData.projects);

  useEffect(() => {
    // Check for local storage updates (simulating DB)
    const savedProjects = localStorage.getItem("portfolio_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Selected Works</h2>
            <p className="text-muted-foreground max-w-[42rem] mx-auto">
              A collection of projects highlighting my approach to design and problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layoutId={`project-card-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="aspect-video w-full bg-muted relative overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                      <span className="text-sm font-medium">Project Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
                      {project.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tools.map((tool) => (
                      <span key={tool} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`project-card-${selectedProject.id}`}
              className="relative w-full max-w-3xl bg-card rounded-xl shadow-lg border overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-video w-full bg-muted shrink-0 relative">
                 {selectedProject.image ? (
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="object-cover w-full h-full"
                    />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                      <span className="text-lg font-medium">Detailed Project Image</span>
                    </div>
                 )}
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                    <p className="text-muted-foreground mt-2">{selectedProject.description}</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Problem</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.details?.problem}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Approach</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.details?.approach}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Outcome</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.details?.outcome}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                     <h4 className="font-semibold text-sm mb-2">Tools Used</h4>
                     <div className="flex flex-wrap gap-2">
                        {selectedProject.tools.map((tool) => (
                          <span key={tool} className="text-xs font-medium border px-2.5 py-0.5 rounded-full">
                            {tool}
                          </span>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
