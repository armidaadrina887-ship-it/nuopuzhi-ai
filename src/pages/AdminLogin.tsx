import { useState } from 'react';
import { useNavigate } from 'react-router';

const CORRECT_USER = 'admin';
const CORRECT_PASS = 'xmadmin';

export function useAdminAuth() {
  const token = localStorage.getItem('admin_auth');
  return token === `${CORRECT_USER}:${CORRECT_PASS}`;
}

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === CORRECT_USER && password === CORRECT_PASS) {
      localStorage.setItem('admin_auth', `${CORRECT_USER}:${CORRECT_PASS}`);
      navigate('/admin');
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1f38 100%)' }}
    >
      <div className="glass-panel p-8 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-[#00a8ff] flex items-center justify-center rounded-sm">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-base">诺浦智</h1>
            <p className="text-[#8ba3c7] text-xs">后台管理</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[#8ba3c7] text-xs font-mono-display block mb-2">
              账号
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full bg-[#0a1628] border border-[#00a8ff]/20 px-4 py-3 text-white text-sm focus:border-[#00a8ff]/50 focus:outline-none transition-colors"
              placeholder="请输入账号"
            />
          </div>
          <div>
            <label className="text-[#8ba3c7] text-xs font-mono-display block mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-[#0a1628] border border-[#00a8ff]/20 px-4 py-3 text-white text-sm focus:border-[#00a8ff]/50 focus:outline-none transition-colors"
              placeholder="请输入密码"
            />
          </div>

          {error && (
            <p className="text-[#ff6b6b] text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 text-[#050505] font-bold text-sm font-mono-display tracking-wider cursor-pointer hover:opacity-90 transition-all"
            style={{
              background: 'linear-gradient(135deg, #00a8ff 0%, #0066cc 100%)',
              boxShadow: '0 0 20px rgba(0, 168, 255, 0.4)',
            }}
          >
            登录
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-[#00a8ff]/60 text-xs hover:text-[#00a8ff] transition-colors">
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
