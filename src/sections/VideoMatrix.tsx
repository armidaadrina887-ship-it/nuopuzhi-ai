import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const videos = [
  { src: '/videos/matrix-hero.mp4', layer: 1, scale: 1.0, opacity: 1, border: true },
  { src: '/videos/matrix-ui.mp4', layer: 1, scale: 1.0, opacity: 1, border: true },
  { src: '/videos/matrix-content.mp4', layer: 1, scale: 1.0, opacity: 1, border: true },
  { src: '/videos/matrix-ui.mp4', layer: 2, scale: 0.8, opacity: 0.6, border: false },
  { src: '/videos/matrix-content.mp4', layer: 2, scale: 0.8, opacity: 0.6, border: false },
  { src: '/videos/matrix-hero.mp4', layer: 2, scale: 0.8, opacity: 0.6, border: false },
  { src: '/videos/matrix-content.mp4', layer: 3, scale: 0.5, opacity: 0.3, border: false },
  { src: '/videos/matrix-hero.mp4', layer: 3, scale: 0.5, opacity: 0.3, border: false },
  { src: '/videos/matrix-ui.mp4', layer: 3, scale: 0.5, opacity: 0.3, border: false },
];

export default function VideoMatrix() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const title = titleRef.current;
    if (!section || !grid || !title) return;

    const cards = grid.querySelectorAll<HTMLDivElement>('.matrix-card');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    // Title reveal
    tl.fromTo(
      title,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.3 },
      0
    );

    // Cards staggered entrance
    cards.forEach((card, i) => {
      const layer = parseInt(card.dataset.layer || '1');
      const rotX = layer === 1 ? 45 : layer === 2 ? 30 : 15;
      const yOffset = layer === 1 ? 60 : layer === 2 ? 40 : 20;

      tl.fromTo(
        card,
        {
          opacity: 0,
          y: yOffset,
          rotateX: rotX,
          scale: 0.9,
        },
        {
          opacity: parseFloat(card.dataset.opacity || '1'),
          y: 0,
          rotateX: 0,
          scale: parseFloat(card.dataset.scale || '1'),
          duration: 0.4,
          ease: 'power2.out',
        },
        0.05 * i + 0.1
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="matrix"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-16 font-mono-display tracking-wider opacity-0"
        >
          <span className="text-gradient">千人千面的内容矩阵</span>
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {videos.map((v, i) => (
            <div
              key={i}
              className={`matrix-card relative overflow-hidden ${
                v.border ? 'neon-border' : ''
              } ${v.layer === 3 ? 'backdrop-blur-sm' : ''}`}
              data-layer={v.layer}
              data-scale={v.scale}
              data-opacity={v.opacity}
              style={{
                transformStyle: 'preserve-3d',
                aspectRatio: '16/10',
                opacity: 0,
              }}
            >
              <video
                src={v.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {v.layer === 3 && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backdropFilter: 'blur(4px)', background: 'rgba(5,5,5,0.3)' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 max-w-2xl mx-auto font-mono-display tracking-wider">
            AI自动生成 · 智能分发 · 全域覆盖
          </p>
          <p className="text-xs text-gray-600 mt-2">
            短视频内容矩阵 / 自动截流系统 / 多平台同步分发
          </p>
        </div>
      </div>
    </section>
  );
}
