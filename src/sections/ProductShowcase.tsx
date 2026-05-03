import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    tag: '产品1',
    name: '超级AI员工',
    price: '3.98W',
    unit: '/年',
    gift: '送1.98W的GEO一年',
    monthly: '3980元/月体验',
    features: ['智能客服 · 自动回复，高效转化', '内容创作 · 文案、图片、视频一键生成', '数据分析 · 洞察趋势，辅助决策', '任务执行 · 日程管理、跟进提醒、自动执行'],
    partners: [
      { label: '代理权', price: '4.98W', desc: '分销得50%佣金' },
      { label: '分公司', price: '10W', desc: '学习流量模型，掌握增长方法' },
      { label: '运营中心', price: '30W', desc: '多AI项目赋能，打造区域生态' },
    ],
    color: '#00a8ff',
  },
  {
    tag: '产品2',
    name: 'GEO产品',
    price: '19800',
    unit: '元/年',
    gift: '精准获客，高效转化',
    monthly: '让流量为你所用',
    features: ['精准定位 · 锁定目标客户', '流量优化 · 提升曝光转化', '数据监测 · 实时优化效果', 'GEO搜索引擎优化全域覆盖'],
    partners: [],
    color: '#00d4ff',
  },
  {
    tag: '产品3',
    name: 'AI+IP企业家联盟',
    price: '10W',
    unit: '',
    gift: '链接顶尖企业家，整合AI+IP资源',
    monthly: '共创商业未来',
    features: ['送超级员工（代理权）价值4.98W', 'GEO服务价值1.98W/年', 'AI私董会 · 高端智囊团陪伴', '企业员工培训 · 名额2人次'],
    partners: [],
    color: '#8b5cf6',
  },
  {
    tag: '产品4',
    name: 'AI培训产品',
    price: '2980',
    unit: '元',
    gift: '从入门到精通，成为AI时代的操盘高手',
    monthly: 'AI徒弟 或 AI操盘手',
    features: ['系统课程 · 0基础到实战应用', '实战案例 · 行业真实场景拆解', '社群陪伴 · 持续学习，共同成长', '升级路径 · 进阶课程，持续提升'],
    partners: [],
    color: '#f5a623',
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    const title = titleRef.current;
    if (!section || !cards || !title) return;

    const items = cards.querySelectorAll<HTMLDivElement>('.product-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    tl.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0);

    items.forEach((item, i) => {
      tl.fromTo(
        item,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' },
        0.1 * i + 0.1
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 font-mono-display tracking-wider opacity-0"
        >
          <span className="text-gradient">四大产品体系</span>
        </h2>
        <p className="text-center text-[#8ba3c7] text-sm mb-16">
          全方位赋能企业与个人
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <div
              key={i}
              className="product-card glass-panel p-6 md:p-8 opacity-0 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderLeft: `3px solid ${product.color}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 text-xs font-mono-display font-bold text-white"
                  style={{ background: product.color }}
                >
                  {product.tag}
                </span>
                <h3 className="text-white text-xl font-bold">{product.name}</h3>
              </div>

              {/* Price area */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl md:text-4xl font-bold font-mono-display"
                    style={{ color: product.color }}
                  >
                    {product.price}
                  </span>
                  <span className="text-[#8ba3c7] text-sm">{product.unit}</span>
                </div>
                {product.gift && (
                  <p className="text-[#f5a623] text-xs mt-1">{product.gift}</p>
                )}
                {product.monthly && (
                  <p className="text-[#8ba3c7] text-xs mt-1">{product.monthly}</p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {product.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span style={{ color: product.color }} className="mt-0.5 text-xs">›</span>
                    <span className="text-[#a8c5e0] text-xs">{f}</span>
                  </div>
                ))}
              </div>

              {/* Partners for product 1 */}
              {product.partners.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#00a8ff]/10">
                  {product.partners.map((p, j) => (
                    <div key={j} className="text-center">
                      <p className="text-[#f5a623] text-xs font-bold">{p.label}</p>
                      <p className="text-white text-sm font-bold">{p.price}</p>
                      <p className="text-[#8ba3c7] text-[10px]">{p.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-6">
                <button
                  className="w-full py-2.5 text-xs font-mono-display tracking-wider text-white transition-all duration-300 cursor-pointer hover:opacity-90"
                  style={{
                    background: product.color,
                    boxShadow: `0 0 15px ${product.color}40`,
                  }}
                >
                  了解详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
