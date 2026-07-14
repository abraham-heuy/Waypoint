import { useState, type FormEvent, useMemo } from 'react';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/primitives';
import { toast } from '../store/toastStore';

// Mock program data – in reality you would fetch this from your backend
const PROGRAMS = [
  {
    id: 'summer-bootcamp-2026',
    title: 'Summer Bootcamp 2026',
    tagline: 'Intensive hands‑on training in route optimization and AI',
    description: `A four‑week immersive program for developers and data scientists who want to master the art of route optimization. You'll work with real‑world datasets, implement heuristic and exact solvers, and learn to integrate AI‑powered insights into logistics applications.`,
    longDescription: `The Summer Bootcamp is designed for practitioners who want to go beyond the basics. Over four weeks, you will:

• Build a route optimization engine from scratch using Python and OR‑Tools.
• Learn to handle time windows, vehicle capacity, and dynamic re‑routing.
• Deploy your solver as a REST API and integrate it with a frontend map.
• Work on capstone projects with mentorship from Waypoint engineers.

The bootcamp includes daily live coding sessions, group project work, and guest lectures from industry leaders.`,
    date: 'July 15 – August 12, 2026',
    status: 'open',
    type: 'Bootcamp',
    location: 'Nairobi, Kenya (hybrid)',
    agenda: [
      'Week 1: Fundamentals of route optimization',
      'Week 2: Heuristic algorithms (OR‑Tools, LKH)',
      'Week 3: Exact solvers (Held‑Karp, branch‑and‑bound)',
      'Week 4: Production deployment and AI integration',
    ],
  },
  {
    id: 'algorithm-optimization-sessions',
    title: 'Algorithm Optimization Sessions',
    tagline: 'Monthly deep‑dives into routing algorithms',
    description: `A series of monthly sessions where we explore the latest advances in routing algorithms. Each session focuses on a specific technique or use‑case, with live demos and Q&A.`,
    longDescription: `These sessions are for engineers, researchers, and enthusiasts who want to stay at the cutting edge of route optimization. Each session covers:

• A deep dive into one algorithm (e.g., Clarke‑Wright, Christofides, or exact TSP solvers).
• Performance benchmarks on real‑world data.
• Implementation walkthroughs in Python or C++.
• Practical tips for integrating algorithms into production systems.

Sessions are recorded and made available to attendees.`,
    date: 'Monthly (2nd Thursday of each month)',
    status: 'open',
    type: 'Workshop',
    location: 'Online',
    agenda: [
      'March: Clarke‑Wright Savings Algorithm',
      'April: Christofides for TSP',
      'May: Exact TSP with branch‑and‑cut',
      'June: Dynamic routing with time windows',
    ],
  },
  {
    id: 'ai-sessions',
    title: 'AI Sessions',
    tagline: 'Leveraging LLMs and machine learning for smarter routing',
    description: `Explore how large language models and ML can enhance route planning. Topics include natural language trip description, predictive ETA, and anomaly detection.`,
    longDescription: `The AI Sessions are a series of talks and workshops focused on applying artificial intelligence to logistics and mobility. We cover:

• Using LLMs to parse natural language stop descriptions.
• Predictive models for travel time estimation.
• Anomaly detection for route deviations.
• Reinforcement learning for dynamic re‑planning.

Sessions are led by Waypoint’s AI research team and guest experts.`,
    date: 'Quarterly (next: May 20, 2027)',
    status: 'coming_soon',
    type: 'Seminar',
    location: 'Online',
    agenda: [
      'Introduction to LLMs for route planning',
      'Fine‑tuning models for ETA prediction',
      'Reinforcement learning for dynamic routing',
      'Case study: anomaly detection in fleet operations',
    ],
  },
  {
    id: 'open-source-contributions',
    title: 'Open Source Contributions',
    tagline: 'Collaborate on Waypoint’s open‑source tools and libraries',
    description: `Join our open‑source community and help build the next generation of routing tools. We maintain several libraries for solving, mapping, and data visualization.`,
    longDescription: `We welcome contributions to our open‑source projects. Whether you're fixing bugs, adding features, or improving documentation, your work helps the entire community.

We have projects in:
• PyRoute – a Python library for route optimization.
• RouteMap – a React component for displaying optimized routes.
• Data pipelines for handling real‑time traffic and weather data.

We offer mentorship for first‑time contributors and regular sync‑ups.`,
    date: 'Ongoing',
    status: 'open',
    type: 'Community',
    location: 'Online / GitHub',
    agenda: [
      'Review open issues and pull requests',
      'Weekly community sync‑ups (Thursdays at 16:00 EAT)',
      'Monthly virtual hackathons',
      'Contributor spotlights',
    ],
  },
];

const TYPE_OPTIONS = ['All', 'Bootcamp', 'Workshop', 'Seminar', 'Community'];
const STATUS_OPTIONS = ['All', 'open', 'coming_soon', 'closed'];

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<typeof PROGRAMS[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Filter states
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter((program) => {
      const typeMatch = typeFilter === 'All' || program.type === typeFilter;
      const statusMatch = statusFilter === 'All' || program.status === statusFilter;
      return typeMatch && statusMatch;
    });
  }, [typeFilter, statusFilter]);

  const openModal = (program: typeof PROGRAMS[0]) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProgram(null);
    setInterestForm({ name: '', email: '', message: '' });
  };

  const handleInterestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInterestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInterest = async (e: FormEvent) => {
    e.preventDefault();
    if (!interestForm.name.trim() || !interestForm.email.trim()) {
      toast.error('Please provide your name and email.');
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    toast.success('Thank you for your interest! We’ll be in touch.');
    closeModal();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/30">Open</span>;
      case 'closed':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/30">Closed</span>;
      case 'coming_soon':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">Coming soon</span>;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setTypeFilter('All');
    setStatusFilter('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Programs</h1>
        <p className="text-dispatch-dim text-lg leading-relaxed">
  Waypoint runs a range of programs designed to advance the science and practice of route optimization – from theoretical foundations to production‑ready systems. Our initiatives include intensive bootcamps, technical workshops, AI research seminars, and open‑source collaborations. Whether you are a developer looking to master routing algorithms, a data scientist exploring AI for logistics, or an open‑source contributor building the next generation of mobility tools, you will find a community that shares your passion. Our goal is to bridge the gap between cutting‑edge research and real‑world impact, equipping participants with the skills, knowledge, and networks to solve complex routing challenges and shape the future of intelligent transportation.
</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl border border-dispatch-line bg-dispatch-panel">
        <div className="flex items-center gap-2">
          <label className="text-xs text-dispatch-dim font-mono uppercase tracking-wider">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-dispatch-dim font-mono uppercase tracking-wider">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'All' ? 'All' : opt.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <Button size="sm" variant="secondary" onClick={clearFilters}>
          Clear filters
        </Button>
        <span className="text-xs text-dispatch-dim ml-auto">
          {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} available
        </span>
      </div>

      {/* Programs grid */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dispatch-dim">No programs match the selected filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6 flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-dispatch-accent">
                    {program.type}
                  </span>
                  {getStatusBadge(program.status)}
                </div>
                <div className="text-xs text-dispatch-dim">{program.date}</div>
              </div>
              <h3 className="text-xl font-semibold mt-3 mb-2">{program.title}</h3>
              <p className="text-dispatch-dim text-sm leading-relaxed flex-1">
                {program.tagline}
              </p>
              <p className="text-dispatch-dim text-sm mt-3">{program.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openModal(program)}
                >
                  Learn more →
                </Button>
                <span className="text-xs text-dispatch-dim">{program.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Program detail modal */}
      {modalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dispatch-panel border-b border-dispatch-line px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedProgram.title}</h2>
                <div className="flex items-center gap-2 text-sm text-dispatch-dim mt-1">
                  <span className="font-mono uppercase tracking-wider text-dispatch-accent">
                    {selectedProgram.type}
                  </span>
                  <span>·</span>
                  {getStatusBadge(selectedProgram.status)}
                  <span>·</span>
                  <span>{selectedProgram.date}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-dispatch-dim hover:text-dispatch-text text-2xl leading-none"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-dispatch-dim mb-2">
                  About this program
                </h3>
                <p className="text-dispatch-text leading-relaxed whitespace-pre-line">
                  {selectedProgram.longDescription}
                </p>
              </div>

              {selectedProgram.agenda && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-dispatch-dim mb-2">
                    Agenda / highlights
                  </h3>
                  <ul className="space-y-1 text-sm text-dispatch-dim list-disc list-inside">
                    {selectedProgram.agenda.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3 text-sm">
                <div>
                  <span className="text-dispatch-dim">Location:</span>{' '}
                  <span className="font-medium">{selectedProgram.location}</span>
                </div>
                <div>
                  <span className="text-dispatch-dim">Status:</span>{' '}
                  <span className="font-medium capitalize">{selectedProgram.status}</span>
                </div>
              </div>

              {/* Interest form – only show if status is open or coming_soon */}
              {selectedProgram.status !== 'closed' && (
                <div className="border-t border-dispatch-line pt-6 mt-2">
                  <h3 className="text-sm font-semibold mb-3">Express your interest</h3>
                  <form onSubmit={handleSubmitInterest} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-dispatch-dim mb-1">Name *</label>
                        <Input
                          name="name"
                          value={interestForm.name}
                          onChange={handleInterestChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-dispatch-dim mb-1">Email *</label>
                        <Input
                          name="email"
                          type="email"
                          value={interestForm.email}
                          onChange={handleInterestChange}
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-dispatch-dim mb-1">Message</label>
                      <textarea
                        name="message"
                        value={interestForm.message}
                        onChange={handleInterestChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
                        placeholder="Tell us a bit about yourself and what you hope to get from this program..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" loading={submitting}>
                        Send interest
                      </Button>
                      <Button variant="secondary" type="button" onClick={closeModal}>
                        Close
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}