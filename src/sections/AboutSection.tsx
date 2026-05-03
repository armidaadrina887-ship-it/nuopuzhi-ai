import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: '2011.11', event: '诺浦智科技公司成立', desc: '创始人团队组建，开启AI技术创业之路' },
  { year: '2014.11', event: '购物商城开源', desc: '开源电商系统获得10万+开发者使用' },
  { year: '2017.06', event: '创博小程序发布', desc: '切入微信生态，赋能百万商家数字化转型' },
  { year: '2019.12', event: '几何裂变发布', desc: '私域裂变增长工具，单日最高裂变100万+用户' },
  { year: '2023.03', event: '创博数字人发布', desc: 'AI数字人直播系统，开启智能化内容时代' },
  { year: '2025.10', event: '诺浦智AI超级员工发布', desc: '集获客·截流·视频·销售于一体的AI营销铁军' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const items = section.querySelectorAll<HTMLDivElement>('.timeline-item');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0);

    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
        0.1 * i + 0.1
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-16 font-mono-display tracking-wider opacity-0"
        >
          <span className="text-gradient">发展历程</span>
        </h2>

        {/* Timeline */}
        <div className="relative">
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#00a8ff]/20"
            style={{ transform: 'translateX(-0.5px)' }}
          />

          {milestones.map((m, i) => (
            <div
              key={i}
              className={`timeline-item relative flex items-start gap-6 mb-10 opacity-0 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-4 md:left-1/2 w-3 h-3 -translate-x-1/2 mt-2">
                <div className="w-full h-full rounded-full bg-[#00a8ff] shadow-[0_0_10px_rgba(0,168,255,0.5)]" />
              </div>

              <div
                className={`ml-10 md:ml-0 md:w-1/2 ${
                  i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}
              >
                <div className="glass-panel p-5 inline-block">
                  <span className="text-[#00a8ff] text-xs font-mono-display tracking-wider">
                    {m.year}
                  </span>
                  <h3 className="text-white font-bold text-sm mt-1">{m.event}</h3>
                  <p className="text-[#8ba3c7] text-xs mt-2">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client info */}
        <div className="mt-16 glass-panel p-6 md:p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-3">服务覆盖区域</h3>
          <p className="text-[#8ba3c7] text-sm max-w-2xl mx-auto">
            我们目前服务的客户，覆盖山东、江浙、河北、广东、福建等多个地区的直播基地和MCN机构，
            累计服务企业超过5000家，帮助客户实现AI驱动的全自动化增长。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['山东省', '江浙地区', '河北省', '广东省', '福建省'].map((region) => (
              <span
                key={region}
                className="px-4 py-1 border border-[#00a8ff]/20 text-[#00a8ff]/70 text-xs font-mono-display"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
