// src/components/skeleton/examples/SkeletonExamples.jsx
import React, { useState, useEffect } from "react";
import {
  SkeletonProvider,
  useSkeletonController,
  SkeletonHero,
  SkeletonProjectCard,
  SkeletonArticle,
  SkeletonList,
  SkeletonBoundary,
  useSkeletonAsync,
} from "../index";

// Example: Hero section with skeleton
export function HeroWithSkeleton() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading hero content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center p-6">
        <SkeletonHero className="max-w-4xl" />
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl text-center">
        <h1 className="text-6xl font-bold mb-6">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600 mb-8">
          I build amazing web experiences with modern technologies.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            View Projects
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}

// Example: Project list with skeleton
export function ProjectListWithSkeleton() {
  const {
    data: projects,
    isLoading,
    error,
  } = useSkeletonAsync(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return [
      { id: 1, title: "Project 1", description: "Amazing project" },
      { id: 2, title: "Project 2", description: "Another great project" },
      { id: 3, title: "Project 3", description: "The best project" },
    ];
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonProjectCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load projects. Please try again.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>
      ))}
    </div>
  );
}

// Example: Article with skeleton
export function ArticleWithSkeleton() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SkeletonArticle />
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">How to Build Amazing Web Apps</h1>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-gray-600 text-sm">2 days ago</p>
        </div>
      </div>
      <img
        src="https://via.placeholder.com/800x400"
        alt="Article"
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <div className="prose max-w-none">
        <p>
          This is a sample article about building amazing web applications...
        </p>
        <p>More content goes here...</p>
      </div>
    </article>
  );
}

// Example: List with skeleton
export function ListWithSkeleton() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <SkeletonList items={5} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>
      <div className="space-y-3">
        {["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson"].map(
          (name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-gray-600 text-sm">Software Engineer</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Example: Using skeleton controller
export function ControlledSkeletonExample() {
  const { showSkeleton, hideSkeleton, isSkeletonVisible } =
    useSkeletonController();
  const [data, setData] = useState(null);

  const loadData = async () => {
    showSkeleton("data-loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setData({ message: "Data loaded successfully!" });
    hideSkeleton("data-loading");
  };

  return (
    <div className="p-6">
      <button
        onClick={loadData}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
      >
        Load Data
      </button>

      {isSkeletonVisible("data-loading") ? (
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
        </div>
      ) : data ? (
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">{data.message}</p>
        </div>
      ) : null}
    </div>
  );
}

// Main examples component
export function SkeletonExamples() {
  return (
    <SkeletonProvider>
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Hero Section</h2>
          <HeroWithSkeleton />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Project List</h2>
          <ProjectListWithSkeleton />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Article</h2>
          <ArticleWithSkeleton />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">List</h2>
          <ListWithSkeleton />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Controlled Skeleton</h2>
          <ControlledSkeletonExample />
        </section>
      </div>
    </SkeletonProvider>
  );
}



