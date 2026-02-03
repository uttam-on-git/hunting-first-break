import React from 'react';

const Intro: React.FC = () => {
  return (
    <section className="relative px-4 py-2">
      <div className="absolute -left-2 top-0 text-3xl opacity-30">"</div>
      <p className="text-lg md:text-xl leading-relaxed text-gray-700 italic">
        I enjoy being heads-down building things. I work end-to-end - frontend to backend - and learn best by shipping real products.
      </p>
      <div className="absolute -right-2 bottom-0 text-3xl opacity-30 rotate-180">"</div>
    </section>
  );
};

export default Intro;
