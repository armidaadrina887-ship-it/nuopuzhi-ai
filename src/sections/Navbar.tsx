import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #00a8ff 0%, #0066cc 100%)',
              boxShadow: '0 0 12px rgba(0, 168, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <span
              className="text-white font-black text-base tracking-tight"
              style={{ fontFamily: 'ui-monospace, "JetBrains Mono", monospace' }}
            >
              N
            </span>
          </div>
          {/* Logo Text */}
          <span
            className="text-white text-lg font-bold tracking-wide"
            style={{
              fontFamily: '-apple-system, "PingFang SC", "Noto Sans SC", sans-serif',
              textShadow: '0 0 10px rgba(0, 168, 255, 0.3)',
            }}
          >
            诺浦智
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: '产品体系', id: 'products' },
            { label: '核心能力', id: 'services' },
            { label: '数据引擎', id: 'datafalls' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-xs font-mono-display tracking-wider text-[#8ba3c7] hover:text-[#00a8ff] transition-colors duration-300 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo('footer')}
          className="text-xs font-mono-display tracking-wider px-4 py-2 text-white transition-all duration-300 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #00a8ff 0%, #0066cc 100%)',
            border: '1px solid rgba(0, 168, 255, 0.5)',
            boxShadow: '0 0 15px rgba(0, 168, 255, 0.2)',
          }}
        >
          立即体验
        </button>
      </div>
    </nav>
  );
}
