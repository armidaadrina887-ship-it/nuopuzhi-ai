import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trpc } from '@/providers/trpc';

gsap.registerPlugin(ScrollTrigger);

const advantages = [
  { title: '全自动', desc: '7×24小时不间断运转，无需人工干预' },
  { title: '低成本', desc: '1套AI系统替代整支营销团队' },
  { title: '高转化', desc: 'AI精准营销，转化率提升300%+' },
];

const fourSystems = [
  { icon: 'AI', title: 'AI工具赋能', desc: '提升效率，降本增效' },
  { icon: 'GEO', title: '流量精准增长', desc: 'GEO精准获客' },
  { icon: 'IP', title: '高端资源链接', desc: 'AI+IP企业家联盟' },
  { icon: 'EDU', title: '人才培养孵化', desc: '培养AI操盘手' },
];

export default function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [formData, setFormData] = useState({ company: '', name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const createLead = trpc.lead.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const advs = section.querySelectorAll('.adv-item');
    const form = section.querySelector('.cta-form');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
    });

    tl.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0);
    advs.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.1 * i + 0.1);
    });
    if (form) {
      tl.fromTo(form, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.3 }, 0.2);
    }

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(formData);
  };

  return (
    <section
      id="footer"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 font-mono-display tracking-wider opacity-0"
        >
          <span className="text-gradient">选择诺浦智 · 拥抱AI未来</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {fourSystems.map((sys, i) => (
            <div key={i} className="glass-panel p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 border border-[#00a8ff]/30 flex items-center justify-center">
                <span className="text-[#00a8ff] text-xs font-mono-display font-bold">{sys.icon}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">{sys.title}</h3>
              <p className="text-[#8ba3c7] text-xs">{sys.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {advantages.map((adv, i) => (
              <div key={i} className="adv-item glass-panel p-5 opacity-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#00a8ff]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#00a8ff] text-xs font-mono-display font-bold">0{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">{adv.title}</h3>
                    <p className="text-[#8ba3c7] text-xs">{adv.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="glass-panel p-5 mt-8">
              <h3 className="text-white font-bold text-sm mb-3">核心产品矩阵</h3>
              <div className="grid grid-cols-2 gap-2">
                {['超级AI员工', 'GEO搜索引擎优化', 'AI+IP企业家联盟', 'AI培训产品', 'AI实体智能仓', '智能获客系统'].map(
                  (product) => (
                    <span
                      key={product}
                      className="text-[#00a8ff]/70 text-xs font-mono-display border border-[#00a8ff]/10 px-2 py-1"
                    >
                      {product}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Admin link */}
            <a
              href="/login"
              className="inline-block mt-6 text-xs font-mono-display text-[#00a8ff]/60 border border-[#00a8ff]/10 px-4 py-2 hover:text-[#00a8ff] hover:border-[#00a8ff]/30 transition-all"
            >
              进入后台管理 →
            </a>
          </div>

          <div className="cta-form glass-panel p-6 md:p-8 opacity-0">
            {!submitted ? (
              <>
                <h3 className="text-white font-bold text-lg mb-2">即刻接入AI超级员工</h3>
                <p className="text-[#8ba3c7] text-xs mb-6">
                  填写企业信息，获取专属AI营销方案
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[#8ba3c7] text-xs font-mono-display block mb-2">
                      企业名称
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#0a1628] border border-[#00a8ff]/20 px-4 py-3 text-white text-sm focus:border-[#00a8ff]/50 focus:outline-none transition-colors"
                      placeholder="请输入企业名称"
                    />
                  </div>
                  <div>
                    <label className="text-[#8ba3c7] text-xs font-mono-display block mb-2">
                      联系人
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0a1628] border border-[#00a8ff]/20 px-4 py-3 text-white text-sm focus:border-[#00a8ff]/50 focus:outline-none transition-colors"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="text-[#8ba3c7] text-xs font-mono-display block mb-2">
                      联系电话
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0a1628] border border-[#00a8ff]/20 px-4 py-3 text-white text-sm focus:border-[#00a8ff]/50 focus:outline-none transition-colors"
                      placeholder="请输入手机号码"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createLead.isPending}
                    className="w-full py-3 text-[#050505] font-bold text-sm font-mono-display tracking-wider transition-all duration-300 cursor-pointer hover:opacity-90 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #00a8ff 0%, #0066cc 100%)',
                      boxShadow: '0 0 20px rgba(0, 168, 255, 0.4)',
                    }}
                  >
                    {createLead.isPending ? '提交中...' : '立即申请体验'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 border border-[#00a8ff]/30 flex items-center justify-center">
                  <span className="text-[#00a8ff] text-2xl">✓</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">提交成功</h3>
                <p className="text-[#8ba3c7] text-xs">
                  我们的AI顾问将在24小时内与您联系
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-[#00a8ff]/10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#00a8ff] flex items-center justify-center rounded-sm">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-white font-bold text-sm">诺浦智</span>
          </div>
          <p className="text-[#5a7a9e] text-xs font-mono-display tracking-wider">
            © 2026 诺浦智人工智能 · 企业AI服务提供商
          </p>
          <p className="text-[#4a6a8e] text-xs mt-2">
            AI获客 + AI引流 + AI销售 + AI实体智能仓 · 共创商业新纪元
          </p>
        </div>
      </div>
    </section>
  );
}
