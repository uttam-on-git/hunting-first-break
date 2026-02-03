
import React from 'react';
import { Copy, FileText, Github, Linkedin, Menu, Twitter } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="relative text-center mb-10">
      <div className="sticky top-4 z-20 mb-6">
        <div className="top-nav inline-flex w-full flex-row items-center justify-between gap-3 text-lg font-handwriting-accent px-4 py-2 bg-[var(--nav-bg)] backdrop-blur sketch-border transition-all duration-300">
          <div className="hidden sm:flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/uttam-on-git"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="link-underline inline-flex items-center gap-2 text-[var(--text-secondary)] transition-all duration-300"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/uttam-in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="link-underline inline-flex items-center gap-2 text-[var(--text-secondary)] transition-all duration-300"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href="https://x.com/forgeweb2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter) profile"
              className="link-underline inline-flex items-center gap-2 text-[var(--text-secondary)] transition-all duration-300"
            >
              <Twitter className="h-4 w-4" aria-hidden="true" />
              X (Twitter)
            </a>
            <a
              href="https://www.dropbox.com/scl/fi/i75h447di27cqbcb4six1/romendra-uttam-v1.pdf?rlkey=ga13n5d4my1tsqixhoutbl6zr&e=1&st=slc7xyru&dl=0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume PDF"
              className="link-underline inline-flex items-center gap-2 text-[var(--text-secondary)] transition-all duration-300"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
            <button
              type="button"
              data-copy-email="romendrauttam@gmail.com"
              className="inline-flex items-center gap-2 hover:underline decoration-wavy decoration-blue-400 text-[var(--text-secondary)] transition-all duration-300"
              aria-label="Copy email address"
              onClick={(e) => {
                const target = e.currentTarget;
                const email = target.getAttribute('data-copy-email') || '';
                if (!email) return;
                navigator.clipboard.writeText(email).then(() => {
                  target.setAttribute('data-copied', 'true');
                  const original = target.querySelector('span');
                  if (original) {
                    original.textContent = 'Copied';
                  }
                  window.setTimeout(() => {
                    target.setAttribute('data-copied', 'false');
                    if (original) {
                      original.textContent = 'Copy email';
                    }
                  }, 1500);
                });
              }}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              <span>Copy email</span>
            </button>
          </div>
          <div className="flex items-center gap-3 sm:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border)] text-[var(--text-secondary)] transition-all duration-300"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <ThemeToggle />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
      <h1 className="text-6xl md:text-7xl font-handwriting-header font-extrabold text-[var(--text-primary)] mb-2 transition-all duration-300">
        Hi, I'm Romendra
      </h1>
      <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-handwriting-accent font-normal transition-all duration-300">
        Full-stack developer shipping projects while hunting for my first break
      </p>
    </header>
  );
};

export default Header;
