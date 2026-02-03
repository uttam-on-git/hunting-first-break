
import React from 'react';
import { BarChart3, Clock, Github, Globe } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  mediaIcon?: React.ReactNode;
  liveUrl?: string;
  codeUrl?: string;
}

const ProjectCard: React.FC<Project & { rotate: string }> = ({
  title,
  description,
  tags,
  icon,
  rotate,
  imageSrc,
  imageAlt,
  mediaIcon,
  liveUrl,
  codeUrl
}) => (
  <div className={`project-card relative p-6 border bg-[var(--bg-card)] border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 ${rotate} hover:rotate-0 hover:scale-[1.04] group mb-8 transition-all duration-300`}>
    {/* Piece of tape on corner */}
    <div className="absolute -top-3 -right-2 tape-piece rotate-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>
    
    <div className="project-media relative w-full aspect-video flex items-center justify-center mb-4 sketch-border bg-[var(--bg-image)] border-[var(--border)] transition-colors overflow-hidden transition-all duration-300">
      {mediaIcon ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="group-hover:scale-[1.06] transition-transform duration-500">
            {mediaIcon}
          </div>
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
        />
      )}
      
    </div>
    
    <h3 className="project-title font-handwriting-header text-2xl font-bold mb-2 text-[var(--text-primary)] group-hover:text-blue-600 transition-colors transition-all duration-300">{title}</h3>
    <p className="project-desc text-sm mb-4 leading-relaxed font-sans text-[var(--text-secondary)] transition-all duration-300">{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View live demo for ${title}`}
          className="project-link project-link-live px-3 py-1 text-xs font-semibold border-2 border-black rounded-md bg-yellow-50 hover:bg-yellow-100 transition-colors text-[var(--text-primary)] transition-all duration-300"
        >
          View Live
        </a>
      ) : null}
      {codeUrl ? (
        <a
          href={codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View code for ${title}`}
          className="project-link project-link-code px-3 py-1 text-xs font-semibold border-2 border-black rounded-md bg-white hover:bg-gray-50 transition-colors text-[var(--text-primary)] transition-all duration-300"
        >
          View Code
        </a>
      ) : null}
    </div>
    
    <div className="flex flex-wrap gap-2 mt-auto">
      {tags.map(tag => (
        <span key={tag} className="project-tag text-[10px] px-2 py-0.5 border border-[var(--border)] rounded-full font-sans tracking-wide text-[var(--text-secondary)] transition-all duration-300">
          #{tag}
        </span>
      ))}
    </div>
  </div>
);

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: "Cesium Resource Explorer",
      description: "A deep dive into 3D geospatial visuals. Exploring the world from the comfort of a browser.",
      tags: ["React", "TypeScript", "CesiumJS"],
      imageSrc: "/screenshots/cesium-resource-explorer.png",
      imageAlt: "Screenshot of Cesium Resource Explorer",
      liveUrl: "https://cesium-resource-explorer.vercel.app/",
      codeUrl: "https://github.com/uttam-on-git/cesium-resource-explorer",
      icon: (
        <Globe className="w-16 h-16 text-[var(--text-secondary)] group-hover:text-blue-200 transition-colors" />
      )
    },
    {
      title: "Acta",
      description: "Finance should be private. Acta keeps your ledger local, safe, and beautiful.",
      tags: ["Next.js", "Prisma", "PostgreSQL"],
      imageSrc: "/screenshots/acta.png",
      imageAlt: "Screenshot of Acta",
      liveUrl: "https://acta-beta.vercel.app/",
      codeUrl: "https://github.com/uttam-on-git/acta",
      icon: (
        <BarChart3 className="w-16 h-16 text-[var(--text-secondary)] group-hover:text-green-200 transition-colors" />
      )
    },
    {
      title: "MindfulBrowse",
      description: "Reclaiming the most valuable resource: attention. A gentle nudge to stay focused.",
      tags: ["JavaScript", "Chrome APIs"],
      imageSrc: "",
      imageAlt: "MindfulBrowse icon",
      codeUrl: "https://github.com/uttam-on-git/MindfulBrowse",
      icon: (
        <Clock className="w-16 h-16 text-[var(--text-secondary)] group-hover:text-yellow-200 transition-colors" />
      ),
      mediaIcon: (
        <Clock className="w-24 h-24 text-[var(--text-secondary)] group-hover:text-yellow-200 transition-colors" />
      )
    },
    {
      title: "More Projects",
      description: "Explore my full GitHub for more builds, experiments, and work-in-progress.",
      tags: ["GitHub", "Open Source", "Side Projects"],
      imageSrc: "",
      imageAlt: "GitHub projects",
      liveUrl: "https://github.com/uttam-on-git",
      icon: (
        <Github className="w-16 h-16 text-[var(--text-secondary)] group-hover:text-blue-200 transition-colors" />
      ),
      mediaIcon: (
        <Github className="w-16 h-16 text-[var(--text-secondary)] group-hover:text-blue-200 transition-colors" />
      )
    }
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-handwriting-header font-bold underline decoration-wavy accent-underline text-[var(--text-primary)]">
          Scrapbook of Projects
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((p, idx) => (
          <ProjectCard 
            key={idx} 
            {...p} 
            rotate={idx % 2 === 0 ? '-rotate-2' : 'rotate-2'}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
