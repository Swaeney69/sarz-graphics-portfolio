"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
                className="group cursor-pointer rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all overflow-hidden hover:border-primary/50"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-video w-full bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                  {project.image ? (
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      priority={false}
                      loading="lazy"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.log("[v0] Image failed to load:", project.image);
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  {!project.image && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                      <span className="text-sm font-medium">Project Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-primary px-3 py-1 rounded-full bg-primary/10 whitespace-nowrap">
                      {project.type}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tools.slice(0, 3).map((tool) => (
                      <span key={tool} className="text-xs font-medium text-foreground/70 bg-muted px-2.5 py-1 rounded-md hover:bg-muted/80 transition-colors">
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="text-xs font-medium text-foreground/70 bg-muted px-2.5 py-1 rounded-md">
                        +{project.tools.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              layoutId={`project-card-${selectedProject.id}`}
              className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl border overflow-hidden max-h-[95vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 hover:bg-background backdrop-blur-sm transition-colors z-10 border border-border/50 hover:border-border"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-video w-full bg-gradient-to-br from-muted to-muted/50 shrink-0 relative overflow-hidden">
                {selectedProject.image ? (
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    priority
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.log("[v0] Modal image failed to load:", selectedProject.image);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                {!selectedProject.image && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                    <span className="text-lg font-medium">Project Image</span>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-primary px-3 py-1 rounded-full bg-primary/10">
                        {selectedProject.type}
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-balance">{selectedProject.title}</h2>
                    <p className="text-muted-foreground text-base leading-relaxed">{selectedProject.description}</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-2"
                    >
                      <h4 className="font-semibold text-sm text-foreground">Problem</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedProject.details?.problem}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-2"
                    >
                      <h4 className="font-semibold text-sm text-foreground">Approach</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedProject.details?.approach}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-2"
                    >
                      <h4 className="font-semibold text-sm text-foreground">Outcome</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedProject.details?.outcome}
                      </p>
                    </motion.div>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Technologies & Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tools.map((tool) => (
                        <motion.span
                          key={tool}
                          whileHover={{ scale: 1.05 }}
                          className="text-xs font-medium border border-border/70 px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors"
                        >
                          {tool}
                        </motion.span>
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
