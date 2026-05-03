import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const painPoints = [
  { label: '获客难', desc: '传统获客成本高昂，线索质量参差不齐' },
  { label: '人工贵', desc: '销售团队人力成本持续攀升' },
  { label: '转化低', desc: '客户跟进不及时导致流失率高' },
  { label: '效率差', desc: '重复性工作占据大量时间精力' },
];

const solutions = [
  { label: 'AI自动获客', desc: '7×24小时不间断精准获客' },
  { label: '智能截流', desc: '自动拦截竞品流量与意向客户' },
  { label: '自动成交', desc: '从触达到成交全链路自动化' },
  { label: '数据驱动', desc: '实时分析优化，持续提升ROI' },
];

export default function DataFalls() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!container || !section || !title) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 1, 1000);
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const particleCount = 3000;
    const colors = [
      new THREE.Color('#00a8ff'),
      new THREE.Color('#00d4ff'),
      new THREE.Color('#f5a623'),
      new THREE.Color('#8b5cf6'),
    ];

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 120 - 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      velocities[i * 3] = (Math.random() - 0.5) * 0.3;
      velocities[i * 3 + 1] = -Math.random() * 1.5 - 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      lifetimes[i] = Math.random();
      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const colorArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i * 3] = c.r;
      colorArray[i * 3 + 1] = c.g;
      colorArray[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const ringGeometry = new THREE.TorusGeometry(25, 0.5, 8, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: '#00a8ff',
      transparent: true,
      opacity: 0.15,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = -20;
    scene.add(ring);

    const innerRingGeometry = new THREE.TorusGeometry(18, 0.3, 8, 48);
    const innerRing = new THREE.Mesh(innerRingGeometry, ringMaterial.clone());
    innerRing.material.opacity = 0.1;
    innerRing.position.z = -20;
    innerRing.rotation.x = Math.PI * 0.3;
    scene.add(innerRing);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      const posArr = geometry.attributes.position.array as Float32Array;
      const sizeArr = geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        lifetimes[i] += dt * 0.3;

        posArr[i * 3] += velocities[i * 3];
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        velocities[i * 3 + 1] -= 0.0007;

        if (posArr[i * 3 + 1] < -60) {
          posArr[i * 3 + 1] = 60;
          posArr[i * 3] = (Math.random() - 0.5) * 80;
          velocities[i * 3 + 1] = -Math.random() * 1.5 - 0.5;
          lifetimes[i] = 0;
        }

        if (posArr[i * 3] > 40 || posArr[i * 3] < -40) {
          velocities[i * 3] *= -0.8;
        }

        sizeArr[i] = (Math.sin(lifetimes[i] * Math.PI) * 0.5 + 0.5) * 3 + 1;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      ring.rotation.z += dt * 0.15;
      ring.rotation.x += dt * 0.05;
      innerRing.rotation.z -= dt * 0.2;
      innerRing.rotation.y += dt * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
    });

    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0);

    const painEls = section.querySelectorAll('.pain-item');
    painEls.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.3 }, 0.1 * i + 0.1);
    });

    const solEls = section.querySelectorAll('.solution-item');
    solEls.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3 }, 0.1 * i + 0.1);
    });

    const handleResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      tl.kill();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      innerRingGeometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="datafalls"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-16 font-mono-display tracking-wider opacity-0"
        >
          <span className="text-gradient">全域数据飞轮</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Pain Points */}
          <div className="space-y-6">
            <h3 className="text-sm font-mono-display tracking-wider text-[#ff6b6b] mb-4">
              传统痛点
            </h3>
            {painPoints.map((p, i) => (
              <div key={i} className="pain-item glass-panel p-4 opacity-0">
                <div className="flex items-center gap-3">
                  <span className="text-[#ff6b6b] text-xs font-mono-display">0{i + 1}</span>
                  <span className="text-white font-bold text-sm">{p.label}</span>
                </div>
                <p className="text-[#8ba3c7] text-xs mt-2 pl-6">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Center: Visual ring */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div
                className="absolute inset-0 border border-[#00a8ff]/30 rounded-full"
                style={{ animation: 'spin 20s linear infinite' }}
              />
              <div
                className="absolute inset-4 border border-[#00a8ff]/15 rounded-full"
                style={{ animation: 'spin 15s linear infinite reverse' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[#00a8ff] text-2xl font-bold font-mono-display">AI</div>
                  <div className="text-[#8ba3c7] text-xs">数据飞轮</div>
                </div>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <h3 className="text-sm font-mono-display tracking-wider text-[#00a8ff] mb-4">
              AI解决方案
            </h3>
            {solutions.map((s, i) => (
              <div key={i} className="solution-item glass-panel p-4 opacity-0">
                <div className="flex items-center gap-3">
                  <span className="text-[#00a8ff] text-xs font-mono-display">0{i + 1}</span>
                  <span className="text-white font-bold text-sm">{s.label}</span>
                </div>
                <p className="text-[#8ba3c7] text-xs mt-2 pl-6">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '10万+', label: '日均获客' },
            { value: '300%', label: '转化提升' },
            { value: '80%', label: '成本降低' },
            { value: '24/7', label: '不间断运转' },
          ].map((stat, i) => (
            <div key={i} className="text-center glass-panel p-4">
              <div className="text-xl md:text-2xl font-bold text-[#00a8ff] font-mono-display">
                {stat.value}
              </div>
              <div className="text-xs text-[#8ba3c7] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
