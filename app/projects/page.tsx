import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";

export const revalidate = 60;

export default async function ProjectsPage() {
  // Filter out invalid projects and log invalid entries
  const validProjects = allProjects.filter((project) => {
    if (!project?.slug || !project?.title || !project?.published) {
      console.warn("Invalid project data detected and skipped:", project);
      return false;
    }
    return true;
  });

  // If no valid projects exist, render a fallback
  if (validProjects.length === 0) {
    console.error("No valid projects found");
    return (
      <div className="relative pb-16">
        <Navigation />
        <div className="px-6 pt-20 mx-auto max-w-7xl lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">No projects available at the moment.</p>
        </div>
      </div>
    );
  }

  // Assign featured and top projects with fallbacks
  const featured = validProjects.find((project) => project.slug === "unkey") || validProjects[0];
  const top2 = validProjects.find((project) => project.slug === "planetfall") || validProjects[1];
  const top3 = validProjects.find((project) => project.slug === "highstorm") || validProjects[2];

  // Sort remaining projects
  const sorted = validProjects
    .filter(
      (project) =>
        project.slug !== featured?.slug &&
        project.slug !== top2?.slug &&
        project.slug !== top3?.slug
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            Projects.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
          <Card>
            <Article project={featured} />
          </Card>

          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
            {[top2, top3]
              .filter((project) => project) // Ensure projects are valid
              .map((project) => (
                <Card key={project.slug}>
                  <Article project={project} />
                </Card>
              ))}
          </div>
        </div>
        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          {[0, 1, 2].map((col) => (
            <div key={col} className="grid grid-cols-1 gap-4">
              {sorted
                .filter((_, i) => i % 3 === col)
                .map((project) => (
                  <Card key={project.slug}>
                    <Article project={project} />
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
