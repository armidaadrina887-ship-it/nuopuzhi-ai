import { useState, useEffect } from 'react';
import { trpc } from '@/providers/trpc';
import { useAdminAuth } from './AdminLogin';
import { useNavigate } from 'react-router';
import type { Lead } from '@db/schema';

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: '新线索', color: '#00a8ff' },
  contacted: { label: '已联系', color: '#f5a623' },
  followup: { label: '跟进中', color: '#8b5cf6' },
  closed: { label: '已成交', color: '#22c55e' },
  archived: { label: '已归档', color: '#64748b' },
};

export default function AdminLeads() {
  const isAuth = useAdminAuth();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/login');
  };

  const { data: leads, isLoading } = trpc.lead.list.useQuery();
  const updateStatus = trpc.lead.updateStatus.useMutation({
    onSuccess: () => utils.lead.list.invalidate(),
  });
  const deleteLead = trpc.lead.delete.useMutation({
    onSuccess: () => utils.lead.list.invalidate(),
  });

  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? leads
    : leads?.filter((l: Lead) => l.status === filter);

  const total = leads?.length ?? 0;
  const today = leads?.filter(
    (l: Lead) => new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length ?? 0;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1f38 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00a8ff] flex items-center justify-center rounded-sm">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">诺浦智 · 客户线索管理</h1>
              <p className="text-[#8ba3c7] text-xs">后台管理系统</p>
            </div>
          </div>
          <a
            href="/"
            className="text-xs font-mono-display text-[#00a8ff] border border-[#00a8ff]/30 px-4 py-2 hover:bg-[#00a8ff]/10 transition-all"
          >
            返回首页
          </a>
          <button
            onClick={handleLogout}
            className="text-xs font-mono-display text-[#ff6b6b] border border-[#ff6b6b]/30 px-4 py-2 hover:bg-[#ff6b6b]/10 transition-all cursor-pointer"
          >
            退出登录
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-[#00a8ff]">{total}</div>
            <div className="text-[#8ba3c7] text-xs mt-1">总线索数</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-[#f5a623]">{today}</div>
            <div className="text-[#8ba3c7] text-xs mt-1">今日新增</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-[#22c55e]">
              {leads?.filter((l: Lead) => l.status === 'closed').length ?? 0}
            </div>
            <div className="text-[#8ba3c7] text-xs mt-1">已成交</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all', label: '全部' },
            { key: 'new', label: '新线索' },
            { key: 'contacted', label: '已联系' },
            { key: 'followup', label: '跟进中' },
            { key: 'closed', label: '已成交' },
            { key: 'archived', label: '已归档' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`px-3 py-1.5 text-xs font-mono-display transition-all cursor-pointer ${
                filter === s.key
                  ? 'bg-[#00a8ff] text-white'
                  : 'border border-[#00a8ff]/20 text-[#8ba3c7] hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-panel overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-[#8ba3c7]">加载中...</div>
          ) : !filtered || filtered.length === 0 ? (
            <div className="p-12 text-center text-[#8ba3c7]">暂无数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#00a8ff]/10">
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">ID</th>
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">企业名称</th>
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">联系人</th>
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">电话</th>
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">状态</th>
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">提交时间</th>
                    <th className="p-4 text-xs font-mono-display text-[#8ba3c7]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((lead: Lead) => {
                    const s = statusMap[lead.status] || statusMap.new;
                    return (
                      <tr key={lead.id} className="border-b border-[#00a8ff]/5 hover:bg-[#00a8ff]/5 transition-colors">
                        <td className="p-4 text-xs text-[#8ba3c7]">#{lead.id}</td>
                        <td className="p-4 text-sm text-white font-medium">{lead.company}</td>
                        <td className="p-4 text-sm text-[#a8c5e0]">{lead.name}</td>
                        <td className="p-4 text-sm text-[#a8c5e0]">{lead.phone}</td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateStatus.mutate({ id: lead.id, status: e.target.value as any })
                            }
                            className="text-xs px-2 py-1 bg-[#0a1628] border border-[#00a8ff]/20 text-white cursor-pointer"
                            style={{ color: s.color }}
                          >
                            {Object.entries(statusMap).map(([key, v]) => (
                              <option key={key} value={key}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-xs text-[#8ba3c7]">
                          {new Date(lead.createdAt).toLocaleString('zh-CN')}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              if (confirm('确定删除这条线索？')) {
                                deleteLead.mutate({ id: lead.id });
                              }
                            }}
                            className="text-xs text-[#ff6b6b] hover:text-[#ff4444] transition-colors cursor-pointer"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
