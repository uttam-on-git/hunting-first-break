import React, { useEffect, useRef } from 'react';

const TARGET_FPS = 6;
const NOISE_SIZE = 240;

const GrainCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(0);
  const reducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = NOISE_SIZE;
    offscreen.height = NOISE_SIZE;
    const offCtx = offscreen.getContext('2d');

    if (!offCtx) {
      return;
    }

    const updateReducedMotion = () => {
      reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    updateReducedMotion();
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updateReducedMotion);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const renderNoise = () => {
      const imageData = offCtx.createImageData(NOISE_SIZE, NOISE_SIZE);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.floor(Math.random() * 255);
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 10;
      }
      offCtx.putImageData(imageData, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreen, 0, 0, window.innerWidth, window.innerHeight);
    };

    const animate = (time: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = time;
      }

      const elapsed = time - lastFrameRef.current;
      const frameMs = 1000 / TARGET_FPS;

      if (elapsed >= frameMs) {
        lastFrameRef.current = time;
        renderNoise();
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    resize();
    renderNoise();

    if (!reducedMotionRef.current) {
      rafRef.current = window.requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      mediaQuery.removeEventListener('change', updateReducedMotion);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="grain-canvas" aria-hidden="true" />;
};

export default GrainCanvas;
