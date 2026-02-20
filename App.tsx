
import React from 'react';
import Header from './components/Header';
import Intro from './components/Intro';
import Projects from './components/Projects';
import Skills from './components/Skills';
import GitHubContributions from './components/GitHubContributions';
import Footer from './components/Footer';
import ChatNote from './components/ChatNote';
import { StarDoodle, ArrowDoodle, SwirlDoodle, OrbitDoodle } from './components/Doodles';
import GrainCanvas from './components/GrainCanvas';

const App: React.FC = () => {
  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center relative">
      <div className="anime-city-bg" aria-hidden="true"></div>
      <GrainCanvas />
      {/* Premium Editorial Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full agency-bg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g className="agency-lines agency-drift-x">
            <path
              d="M-50 120 C 200 80, 360 160, 620 120 S 980 160, 1300 110"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M-80 520 C 220 460, 440 560, 760 520 S 1060 580, 1320 520"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g className="agency-lines agency-drift-x-slow">
            <path
              d="M-60 300 C 180 260, 420 340, 700 300 S 1040 340, 1320 290"
              vectorEffect="non-scaling-stroke"
            />
          </g>
          <g className="agency-dots agency-float">
            <circle cx="120" cy="220" r="3" />
            <circle cx="260" cy="640" r="2" />
            <circle cx="520" cy="140" r="2.5" />
            <circle cx="820" cy="620" r="2" />
            <circle cx="980" cy="220" r="3" />
            <circle cx="1120" cy="460" r="2.5" />
          </g>
        </svg>
      </div>
      {/* Background Doodles */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <StarDoodle className="absolute top-10 left-[10%] w-16 h-16 text-yellow-500 doodle-float" />
        <ArrowDoodle className="absolute top-1/3 right-[5%] w-24 h-24 text-blue-400 rotate-45 doodle-sway" />
        <SwirlDoodle className="absolute bottom-20 left-[5%] w-20 h-20 text-green-400 doodle-float-slow" />
        <StarDoodle className="absolute bottom-1/4 right-[12%] w-12 h-12 text-pink-400 doodle-float" />
        <OrbitDoodle className="absolute top-[15%] left-[55%] w-24 h-24 text-orange-400 opacity-80" />
      </div>

      {/* Main Container Wrapper for Sticky Interaction */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 lg:gap-8 items-start justify-center">
        
        {/* Left Side: Sticky Note (Desktop) */}
        <div className="hidden lg:block sticky top-10 w-80 xl:w-96">
          <ChatNote />
        </div>

        {/* Central Paper Container */}
        <main className="main-panel relative w-full max-w-4xl bg-white/95 backdrop-blur-md p-8 md:p-10 lg:p-11 sketch-border paper-shadow z-10">
          <div className="absolute top-0 left-0 w-full h-full paper-texture opacity-30 pointer-events-none rounded-[inherit]"></div>
          
          <div className="tape absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 opacity-70" />
          
          <Header />
          
          <div className="my-10 sketch-line opacity-20" />
          
          <Projects />
          
          <div className="my-10 sketch-line opacity-20" />
          
          <Intro />
          
          <div className="my-10 sketch-line opacity-20" />
          
          <Skills />

          <section className="mb-12">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <GitHubContributions username="uttam-on-git" />
            </div>
          </section>

          {/* Mobile ChatNote */}
          <div className="lg:hidden mt-12">
            <ChatNote />
          </div>
          
          <div className="my-12 flex flex-col items-center gap-4">
            <a
              href="https://cal.com/uttam-cal/"
              target="_blank"
              rel="noopener noreferrer"
              className="hire-button group relative inline-flex items-center gap-3 px-10 py-4 font-handwriting-header text-3xl border-2 border-black rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-all duration-300 transform hover:-rotate-1 hover:scale-[1.04] active:scale-95"
            >
              Hire me!
              <span className="hire-sub text-xl font-handwriting-accent border-2 border-black rounded-full px-3 py-1 bg-white group-hover:bg-yellow-50 transition-colors">
                Book a call
              </span>
              {/* <ArrowDoodle className="absolute -right-16 top-0 w-12 h-12 text-black -rotate-12 hidden md:block" /> */}
            </a>
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default App;
