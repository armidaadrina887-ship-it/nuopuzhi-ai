import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from '../shaders/pbrLiquidSteel.vert?raw';
import fragmentShader from '../shaders/pbrLiquidSteel.frag?raw';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
      uBrushSize: { value: 3.0 },
      uFluidDecay: { value: 0.95 },
      uTrailLength: { value: 0.8 },
      uStopDecay: { value: 0.9 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;
      uniforms.uMouse.value.set(m.x, m.y);

      renderer.render(scene, camera);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const handleResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Letter glow animation
  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!title || !subtitle) return;

    const chars = title.querySelectorAll<HTMLSpanElement>('.char');
    chars.forEach((char, i) => {
      setTimeout(() => {
        char.style.color = '#00a8ff';
        char.style.textShadow = '0px 0px 20px rgba(0, 168, 255, 0.8)';
        setTimeout(() => {
          char.style.color = '#ffffff';
          char.style.textShadow = 'none';
        }, 1200);
      }, i * 80);
    });

    // Subtitle fade in
    setTimeout(() => {
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
    }, chars.length * 80 + 400);
  }, []);

  const titleText = '诺浦智人工智能';
  const titleChars = titleText.split('');

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Deep blue gradient overlay on top of shader */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.85) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center justify-center h-full px-4"
        style={{ pointerEvents: 'none' }}
      >
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-wider"
        >
          {titleChars.map((char, i) => (
            <span
              key={i}
              className="char inline-block transition-colors duration-300"
              style={{ 
                color: '#ffffff',
                textShadow: '0 0 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-[#a8c5e0] max-w-2xl text-center mb-8 transition-all duration-700"
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          用AI重构商业增长 · 用智能创造无限可能
        </p>

        <div className="flex flex-col items-center gap-4" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono-display text-[#f5a623] tracking-wider">
              四大产品体系 · 全方位赋能企业与个人
            </span>
          </div>
          <button 
            className="px-8 py-3 text-sm font-mono-display tracking-widest text-white transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #00a8ff 0%, #0066cc 100%)',
              boxShadow: '0 0 30px rgba(0, 168, 255, 0.4), 0 4px 15px rgba(0,0,0,0.3)',
              border: '1px solid rgba(0, 168, 255, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 168, 255, 0.6), 0 4px 15px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 168, 255, 0.4), 0 4px 15px rgba(0,0,0,0.3)';
            }}
          >
            开启全自动化模式
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-px h-8 bg-[#00a8ff]/50 animate-pulse" />
        <div className="w-2 h-2 border border-[#00a8ff]/60 rotate-45 animate-bounce" />
      </div>
    </section>
  );
}
