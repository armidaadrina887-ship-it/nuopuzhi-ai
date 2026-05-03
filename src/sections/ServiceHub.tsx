import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceCard {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  color: string;
}

const services: ServiceCard[] = [
  {
    title: 'AI获客',
    subtitle: 'AI ACQUISITION',
    description: '智能精准获客系统',
    features: ['多平台线索自动采集', '智能客户画像分析', 'GEO精准地域定位', '24小时自动外呼触达'],
    image: '/images/card-customer.jpg',
    color: '#00a8ff',
  },
  {
    title: 'AI截流',
    subtitle: 'AI INTERCEPTION',
    description: '自动化流量拦截引擎',
    features: ['竞品评论区自动截流', '热搜话题实时追踪', '智能私信自动触达', '关键词精准拦截'],
    image: '/images/card-data.jpg',
    color: '#00d4ff',
  },
  {
    title: 'AI视频',
    subtitle: 'AI VIDEO',
    description: '短视频内容智能工厂',
    features: ['AI脚本自动生成', '数字人自动播报', '智能剪辑批量产出', '多平台一键分发'],
    image: '/images/card-video.jpg',
    color: '#0077ff',
  },
  {
    title: 'AI销售',
    subtitle: 'AI SALES',
    description: '全自动化成交系统',
    features: ['智能客服7×24小时', '自动报价与跟进', '成交数据分析预测', '私域流量自动转化'],
    image: '/images/card-sales.jpg',
    color: '#0099ff',
  },
];

export default function ServiceHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const title = titleRef.current;
    if (!section || !grid || !title) return;

    const cards = grid.querySelectorAll<HTMLDivElement>('.iso-card');
    const cardPairs: { card: HTMLDivElement; fold: HTMLDivElement | null }[] = [];
    cards.forEach((card) => {
      const fold = card.querySelector<HTMLDivElement>('.iso-fold .photo');
      cardPairs.push({ card, fold });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 1,
      },
    });

    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0);

    cards.forEach((card, idx) => {
      tl.fromTo(
        card,
        { opacity: 0, y: 50, rotateY: -30 },
        { opacity: 1, y: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' },
        0.1 * idx + 0.1
      );
    });

    const handleGridHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const activeCard = target.closest('.iso-card') as HTMLDivElement | null;
      if (!activeCard) return;

      grid.classList.add('is-expand');
      cardPairs.forEach(({ card }, idx) => {
        card.classList.remove('is-hover');
        if (card === activeCard) {
          card.classList.add('is-hover');
        } else {
          card.style.transform = `translateZ(-30px) translateX(${idx * 10}px) translateY(${idx * 10}px)`;
        }
      });
    };

    const handleGridLeave = () => {
      grid.classList.remove('is-expand');
      cardPairs.forEach(({ card }, idx) => {
        if (card.classList.contains('is-hover')) {
          card.classList.remove('is-hover');
        }
        card.style.transform = `translateZ(-120px) translateX(${idx * 10}px) translateY(${idx * 10}px)`;
      });
    };

    grid.addEventListener('mouseenter', handleGridHover, true);
    grid.addEventListener('mouseleave', handleGridLeave);

    return () => {
      tl.kill();
      grid.removeEventListener('mouseenter', handleGridHover, true);
      grid.removeEventListener('mouseleave', handleGridLeave);
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-20 font-mono-display tracking-wider opacity-0"
        >
          <span className="text-gradient">四象限智能架构</span>
        </h2>

        {/* Desktop: Isometric 3D View */}
        <div className="hidden lg:flex justify-center items-center" style={{ minHeight: '500px' }}>
          <div
            className="iso-stack-wrapper relative"
            style={{
              width: '900px',
              transform: 'translateX(-50%) translateY(-50%) rotateX(55deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          >
            <div
              ref={gridRef}
              className="iso-device-grid grid grid-cols-2 gap-6"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateZ(0px) translateY(-50px) translateX(-120px)',
                perspective: '1200px',
              }}
            >
              {services.map((service, idx) => (
                <ServiceIsoCard key={idx} service={service} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Stacked Grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <MobileServiceCard key={idx} service={service} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#8ba3c7] font-mono-display tracking-wider">
            小龙虾Agent · 指令下达后，AI主动完成任务
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceIsoCard({ service }: { service: ServiceCard }) {
  return (
    <div
      className="iso-card relative cursor-pointer"
      style={{
        width: '200px',
        height: '300px',
        transform: 'rotateY(-180deg)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s ease-out, box-shadow 0.6s ease-out',
      }}
    >
      {/* Outside bottom face */}
      <div
        className="iso-face outside-bottom absolute inset-0 flex flex-col items-center justify-center p-4"
        style={{
          width: '200px',
          height: '300px',
          backfaceVisibility: 'hidden',
          background: '#0d2137',
          border: `1px solid ${service.color}40`,
          transform: 'translateZ(-101px)',
        }}
      >
        <span className="font-mono-display text-xs tracking-widest mb-2" style={{ color: service.color }}>
          {service.subtitle}
        </span>
        <span className="text-white text-lg font-bold">{service.title}</span>
      </div>

      {/* Inside bottom face */}
      <div
        className="iso-face inside-bottom absolute top-0 left-0 flex flex-col items-start justify-start p-4"
        style={{
          width: '200px',
          height: '300px',
          backfaceVisibility: 'hidden',
          background: service.color,
          opacity: 0,
          transition: 'opacity 0.6s ease-out',
        }}
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-24 object-cover mb-3"
          style={{ filter: 'brightness(0.9)' }}
        />
        <span className="text-[#050505] text-sm font-bold mb-2">{service.title}</span>
        {service.features.map((f, i) => (
          <span key={i} className="text-[#050505]/80 text-xs leading-relaxed">
            · {f}
          </span>
        ))}
      </div>

      {/* Fold face */}
      <div
        className="iso-fold absolute"
        style={{
          bottom: 0,
          left: 0,
          width: '200px',
          height: '300px',
          transformOrigin: 'bottom center',
          transform: 'translateY(-150px) rotateX(90deg) scaleY(177)',
          backfaceVisibility: 'hidden',
          transition: 'transform 0.6s ease-out',
        }}
      >
        <div
          className="photo absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${service.image})`,
            backgroundSize: 'cover',
            transform: 'scaleY(-1)',
          }}
        />
      </div>
    </div>
  );
}

function MobileServiceCard({ service }: { service: ServiceCard }) {
  return (
    <div
      className="glass-panel p-6 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
      style={{ borderLeft: `3px solid ${service.color}` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 border flex items-center justify-center" style={{ borderColor: `${service.color}50` }}>
          <span className="text-xs font-mono-display font-bold" style={{ color: service.color }}>
            {service.subtitle.split(' ')[1]?.substring(0, 2) || 'AI'}
          </span>
        </div>
        <div>
          <h3 className="text-white font-bold">{service.title}</h3>
          <span className="text-xs font-mono-display" style={{ color: `${service.color}99` }}>{service.subtitle}</span>
        </div>
      </div>
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-32 object-cover mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <p className="text-[#8ba3c7] text-sm mb-3">{service.description}</p>
      <ul className="space-y-1">
        {service.features.map((f, i) => (
          <li key={i} className="text-[#6b8ab0] text-xs flex items-start gap-2">
            <span style={{ color: service.color }} className="mt-0.5">›</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
