
import React from 'react';
import { Copy, FileText, Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-100">
      <div className="grid grid-cols-2 gap-4 font-handwriting-accent text-xl sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
        <a 
          href="https://github.com/uttam-on-git" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-2 text-gray-600 transition-all duration-300"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          GitHub
        </a>
        <a 
          href="https://www.linkedin.com/in/uttam-in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-2 text-gray-600 transition-all duration-300"
        >
          <Linkedin className="h-4 w-4" aria-hidden="true" />
          LinkedIn
        </a>
        <a 
          href="https://x.com/forgeweb2" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-2 text-gray-600 transition-all duration-300"
        >
          <Twitter className="h-4 w-4" aria-hidden="true" />
          X (Twitter)
        </a>
        <a 
          href="https://www.dropbox.com/scl/fi/i75h447di27cqbcb4six1/romendra-uttam-v1.pdf?rlkey=ga13n5d4my1tsqixhoutbl6zr&e=1&st=slc7xyru&dl=0" 
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline inline-flex items-center gap-2 text-gray-600 transition-all duration-300"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          Resume
        </a>
        <button
          type="button"
          data-copy-email="romendrauttam@gmail.com"
          className="inline-flex items-center gap-2 hover:underline decoration-wavy decoration-blue-400 text-gray-600"
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
      <p className="text-center mt-6 text-sm text-gray-400 opacity-60">
        Handcrafted by Romendra &bull; 2026
      </p>
    </footer>
  );
};

export default Footer;
