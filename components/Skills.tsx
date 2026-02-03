
import React, { useState } from 'react';
import { Atom, Braces, Circle, Database, GitBranch, Globe, Layers, Network, Package, Palette, Plug, Server, Terminal } from 'lucide-react';

const Skills: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const skillIcons: Record<string, React.ElementType> = {
    React: Atom,
    'Next.js': Layers,
    'Tailwind CSS': Palette,
    TypeScript: Braces,
    'Node.js': Server,
    PostgreSQL: Database,
    Prisma: Network,
    'REST APIs': Plug,
    Git: GitBranch,
    Docker: Package,
    Linux: Terminal,
    CesiumJS: Globe
  };

  const skillCategories = [
    { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "TypeScript"] },
    { name: "Backend", items: ["Node.js", "PostgreSQL", "Prisma", "REST APIs"] },
    { name: "Others", items: ["Git", "Docker", "Linux", "CesiumJS"] }
  ];

  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-handwriting-header font-bold mb-4 sm:mb-6 underline decoration-wavy decoration-green-300">
        Toolbox
      </h2>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 text-center sm:text-left">
        {skillCategories.map(cat => {
          const isOpen = openCategory === cat.name;
          return (
            <div key={cat.name} className="space-y-2 sm:space-y-3">
              <button
                type="button"
                className="sm:hidden w-full font-handwriting-accent text-xl font-semibold text-gray-800 border-b border-gray-200 inline-flex items-center justify-between pb-1"
                onClick={() => setOpenCategory(isOpen ? null : cat.name)}
                aria-expanded={isOpen}
              >
                <span>{cat.name}</span>
                <span className="text-sm">{isOpen ? '−' : '+'}</span>
              </button>
              <h3 className="hidden sm:inline-block font-handwriting-accent text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1">
                {cat.name}
              </h3>
              <ul className={`${isOpen ? 'grid' : 'hidden'} grid-cols-2 gap-2 sm:gap-3 sm:block`}>
                {cat.items.map(item => {
                  const Icon = skillIcons[item] || Circle;
                  return (
                    <li key={item} className="skill-item flex items-center gap-2 group justify-center sm:justify-start">
                      <span className="skill-check w-4 h-4 sm:w-5 sm:h-5 border border-gray-400 rounded-sm flex-shrink-0 transition-colors"></span>
                      <Icon className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden="true" />
                      <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
