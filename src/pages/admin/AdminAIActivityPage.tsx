import { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import AdminTable from '../../components/admin/AdminTable';
import Button from '../../components/ui/Button';
import {
  fetchAiMetrics,
  fetchAiPipelines,
  fetchAiTrainingJobs,
  type AiMetrics,
  type AiPipeline,
  type AiTrainingJob,
} from '../../lib/adminApi';

export default function AdminAiActivityPage() {
  const [metrics, setMetrics] = useState<AiMetrics | null>(null);
  const [pipelines, setPipelines] = useState<AiPipeline[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<AiTrainingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'pipelines' | 'logs'>('overview');

  useEffect(() => {
    const fetchAll = async () => {
      const [m, p, t] = await Promise.all([
        fetchAiMetrics(),
        fetchAiPipelines(),
        fetchAiTrainingJobs(),
      ]);
      if (m.ok && m.data) setMetrics(m.data);
      if (p.ok && p.data) setPipelines(p.data);
      if (t.ok && t.data) setTrainingJobs(t.data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <div className="text-dispatch-dim text-sm">Loading AI metrics…</div>;
  if (!metrics) return <div className="text-dispatch-danger text-sm">Could not load AI data.</div>;

  const maxRequests = Math.max(...metrics.requestsByDay.map((d) => d.count), 1);
  const maxTokens = Math.max(...metrics.requestsByDay.map((d) => d.tokens), 1);
  const maxCost = Math.max(...metrics.requestsByDay.map((d) => d.costCents), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Activity</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">Fine-tune</Button>
          <Button size="sm" variant="secondary">Add training data</Button>
          <Button size="sm" variant="secondary">Pipeline config</Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total requests" value={metrics.totalRequests} />
        <StatCard label="Total tokens" value={metrics.totalTokens.toLocaleString()} />
        <StatCard label="Cost" value={`$${(metrics.totalCostCents / 100).toFixed(2)}`} accent />
        <StatCard label="Avg response" value={`${metrics.avgResponseMs} ms`} />
        <StatCard label="Success rate" value={`${(metrics.successRate * 100).toFixed(1)}%`} />
        <StatCard label="Error rate" value={`${(metrics.errorRate * 100).toFixed(1)}%`} />
        <StatCard label="Avg tokens/req" value={metrics.avgTokensPerRequest.toLocaleString()} />
        <StatCard label="p95 latency" value={`${metrics.latencyPercentiles.p95} ms`} accent />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dispatch-line overflow-x-auto">
        {(['overview', 'config', 'pipelines', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-mono uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'border-dispatch-accent text-dispatch-accent'
                : 'border-transparent text-dispatch-dim hover:text-dispatch-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
          {/* Charts row */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Requests / day
              </div>
              <svg viewBox="0 0 100 40" className="w-full h-28" preserveAspectRatio="none">
                {metrics.requestsByDay.map((d, i) => (
                  <rect
                    key={d.date}
                    x={(i / metrics.requestsByDay.length) * 100}
                    y={40 - (d.count / maxRequests) * 36}
                    width={100 / metrics.requestsByDay.length * 0.7}
                    height={(d.count / maxRequests) * 36}
                    className="fill-dispatch-accent"
                    opacity={0.85}
                  />
                ))}
              </svg>
            </div>
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Tokens / day
              </div>
              <svg viewBox="0 0 100 40" className="w-full h-28" preserveAspectRatio="none">
                {metrics.requestsByDay.map((d, i) => (
                  <rect
                    key={d.date}
                    x={(i / metrics.requestsByDay.length) * 100}
                    y={40 - (d.tokens / maxTokens) * 36}
                    width={100 / metrics.requestsByDay.length * 0.7}
                    height={(d.tokens / maxTokens) * 36}
                    className="fill-dispatch-accentDim"
                    opacity={0.7}
                  />
                ))}
              </svg>
            </div>
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Cost / day (cents)
              </div>
              <svg viewBox="0 0 100 40" className="w-full h-28" preserveAspectRatio="none">
                {metrics.requestsByDay.map((d, i) => (
                  <rect
                    key={d.date}
                    x={(i / metrics.requestsByDay.length) * 100}
                    y={40 - (d.costCents / maxCost) * 36}
                    width={100 / metrics.requestsByDay.length * 0.7}
                    height={(d.costCents / maxCost) * 36}
                    className="fill-dispatch-accent"
                    opacity={0.6}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Request types & latency */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Request types
              </div>
              <div className="space-y-2">
                {metrics.requestTypes.map((rt) => (
                  <div key={rt.type} className="flex justify-between text-sm">
                    <span className="text-dispatch-dim">{rt.type}</span>
                    <span className="font-mono">{rt.count} reqs · {rt.avgLatencyMs} ms</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Latency percentiles (ms)
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-dispatch-dim">p50</span>
                  <span className="font-mono">{metrics.latencyPercentiles.p50}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dispatch-dim">p90</span>
                  <span className="font-mono">{metrics.latencyPercentiles.p90}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dispatch-dim">p95</span>
                  <span className="font-mono">{metrics.latencyPercentiles.p95}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dispatch-dim">p99</span>
                  <span className="font-mono">{metrics.latencyPercentiles.p99}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost breakdown & model usage */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Cost by model
              </div>
              <div className="space-y-2">
                {metrics.costByModel.map((c) => (
                  <div key={c.model} className="flex justify-between text-sm">
                    <span className="text-dispatch-dim">{c.model}</span>
                    <span className="font-mono">
                      ${(c.costCents / 100).toFixed(2)} · {c.tokenCount.toLocaleString()} tokens
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
                Daily breakdown (last 7 days)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-dispatch-line">
                      <th className="text-left py-1 text-dispatch-dim font-mono">Date</th>
                      <th className="text-right py-1 text-dispatch-dim font-mono">Requests</th>
                      <th className="text-right py-1 text-dispatch-dim font-mono">Tokens</th>
                      <th className="text-right py-1 text-dispatch-dim font-mono">Cost (¢)</th>
                      <th className="text-right py-1 text-dispatch-dim font-mono">Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.requestsByDay.slice(-7).map((d) => (
                      <tr key={d.date} className="border-b border-dispatch-line/50">
                        <td className="py-1 text-dispatch-dim">{d.date}</td>
                        <td className="text-right font-mono">{d.count}</td>
                        <td className="text-right font-mono">{d.tokens.toLocaleString()}</td>
                        <td className="text-right font-mono">{d.costCents}</td>
                        <td className="text-right font-mono text-dispatch-danger">{d.errors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Model usage summary */}
          <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-dispatch-dim mb-3">
              Model usage summary
            </div>
            <div className="space-y-2">
              {metrics.models.map((m) => (
                <div key={m.name} className="flex justify-between text-sm">
                  <span className="text-dispatch-dim">{m.name}</span>
                  <span className="font-mono">
                    {m.requests} reqs · avg {m.avgTokens} tokens
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold">Prompt templates</h3>
                <p className="text-xs text-dispatch-dim">Active templates used for different AI tasks</p>
              </div>
              <Button size="sm">New template</Button>
            </div>
            <ul className="space-y-2">
              {metrics.promptTemplates.map((t) => (
                <li key={t.id} className="flex justify-between items-center border-b border-dispatch-line/50 py-2">
                  <div>
                    <span className="text-sm">{t.name}</span>
                    <span className="text-xs text-dispatch-dim ml-3">v{t.version}</span>
                    {t.active && <span className="text-xs text-green-500 ml-3">● Active</span>}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-dispatch-dim hover:text-dispatch-text">Edit</button>
                    <button className="text-xs text-dispatch-dim hover:text-dispatch-text">Set active</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold">Simplified handler</h3>
                <p className="text-xs text-dispatch-dim">Tokenization and response handling settings</p>
              </div>
              <Button size="sm" variant="secondary">Save</Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-dispatch-dim block mb-1">Max tokens per request</label>
                <input type="number" defaultValue={1500} className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm" />
              </div>
              <div>
                <label className="text-xs text-dispatch-dim block mb-1">Temperature</label>
                <input type="number" step="0.1" defaultValue={0.7} className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm" />
              </div>
              <div>
                <label className="text-xs text-dispatch-dim block mb-1">Response format</label>
                <select className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm">
                  <option>JSON structured</option>
                  <option>Plain text</option>
                  <option>Markdown</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-dispatch-dim block mb-1">Model version</label>
                <select className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm">
                  <option>gpt-4-turbo</option>
                  <option>gpt-3.5-turbo</option>
                  <option>claude-3-sonnet</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pipelines' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">AI Pipelines</h2>
            <Button size="sm">New pipeline</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {pipelines.map((p) => (
              <div key={p.id} className="rounded-lg border border-dispatch-line bg-dispatch-panel p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{p.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === 'active'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                      : p.status === 'inactive'
                      ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                      : 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                  }`}>{p.status}</span>
                </div>
                {p.accuracy !== null && <div className="text-xs text-dispatch-dim">Accuracy: {(p.accuracy * 100).toFixed(1)}%</div>}
                {p.lastRun && <div className="text-xs text-dispatch-dim">Last run: {new Date(p.lastRun).toLocaleString()}</div>}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="secondary">Run</Button>
                  <Button size="sm" variant="secondary">Edit</Button>
                  <Button size="sm" variant="secondary">Logs</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">Training jobs</h2>
            <Button size="sm">New training job</Button>
          </div>
          <AdminTable
            columns={[
              { key: 'name', header: 'Job name' },
              { key: 'status', header: 'Status', render: (row: AiTrainingJob) => (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  row.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                  : row.status === 'running' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                  : row.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                }`}>{row.status}</span>
              ) },
              { key: 'progress', header: 'Progress', render: (row: AiTrainingJob) => `${row.progress}%` },
              { key: 'createdAt', header: 'Created', render: (row: AiTrainingJob) => new Date(row.createdAt).toLocaleDateString() },
            ]}
            rows={trainingJobs}
            loading={false}
            error={null}
            emptyMessage="No training jobs."
          />
        </div>
      )}
    </div>
  );
}