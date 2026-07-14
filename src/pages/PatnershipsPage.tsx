import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/primitives';
import { submitPartnershipRequest } from '../lib/api';
import { toast } from '../store/toastStore';

export default function PartnershipsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    message: '',
    integrationType: '',
    callRequested: false,
    nature: '',
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setForm({
      companyName: '',
      contactName: '',
      contactEmail: '',
      message: '',
      integrationType: '',
      callRequested: false,
      nature: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.contactEmail.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const result = await submitPartnershipRequest(form);
    setSubmitting(false);
    if (result.ok) {
      toast.success('Partnership request sent! We’ll get back to you shortly.');
      closeModal();
    } else {
      toast.error(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">Partnerships</h1>
        <p className="text-dispatch-dim text-lg leading-relaxed">
          Waypoint partners with forward‑looking organisations to build the future of
          intelligent mobility. Whether you are a logistics provider, a software platform,
          or a service operator, we offer collaboration models that combine our routing
          technology with your domain expertise.
        </p>
        <Button size="lg" className="mt-8" onClick={openModal}>
          Become a partner
        </Button>
      </div>

      {/* Why partner */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Why partner with Waypoint</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-lg font-semibold mb-3">Technology leadership</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Our solver combines exact algorithms (Held‑Karp for small n) with heuristic
              engines (OR‑Tools) for large fleets. Partners gain direct access to this
              technology, which handles real‑world constraints like time windows,
              vehicle capacity, and dynamic re‑routing.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-lg font-semibold mb-3">Ecosystem integration</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Join a network of logistics, rideshare, and last‑mile delivery providers.
              We offer pre‑built connectors and a flexible API that fits into existing
              workflows – from dispatch systems to customer‑facing apps.
            </p>
          </div>
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-lg font-semibold mb-3">Commercial growth</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Partners benefit from co‑marketing, referral incentives, and revenue‑share
              models. We help you differentiate your offering with advanced route
              optimisation and AI‑powered insights, increasing customer retention and
              wallet share.
            </p>
          </div>
        </div>
      </div>

      {/* Partnership models */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">Partnership models</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-xl font-semibold mb-3">API integration</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Embed Waypoint’s route optimisation engine directly into your application.
              Our REST API provides real‑time solving, rideshare fallback, and detailed
              trip analytics. You pay only for what you use, with transparent, usage‑based
              pricing.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-dispatch-dim list-disc list-inside">
              <li>Scale from 2 to 200 stops per route</li>
              <li>Supports time windows, vehicle types, and multi‑modal legs</li>
              <li>Dedicated sandbox environment for testing</li>
              <li>Detailed logs and performance monitoring</li>
            </ul>
            <Button
              variant="secondary"
              size="sm"
              className="mt-5"
              onClick={openModal}
            >
              Request API access →
            </Button>
          </div>

          <div className="rounded-xl border border-dispatch-line bg-dispatch-panel p-6">
            <h3 className="text-xl font-semibold mb-3">Strategic alliance</h3>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              For organisations looking to co‑develop go‑to‑market solutions, integrate
              Waypoint at a deeper level, or jointly serve enterprise clients. This model
              includes custom SLAs, dedicated engineering support, and shared
              product‑roadmap planning.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-dispatch-dim list-disc list-inside">
              <li>Co‑branded and white‑label options</li>
              <li>Joint sales and marketing initiatives</li>
              <li>Priority feature development</li>
              <li>Volume‑based and enterprise pricing</li>
            </ul>
            <Button
              variant="secondary"
              size="sm"
              className="mt-5"
              onClick={openModal}
            >
              Explore alliance →
            </Button>
          </div>
        </div>
      </div>

      {/* What you get */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-8 text-center">What partners receive</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-dispatch-line rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-dispatch-accent mb-2">API</div>
            <p className="text-dispatch-dim text-sm">Full access to all optimisation endpoints with comprehensive documentation.</p>
          </div>
          <div className="border border-dispatch-line rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Support</div>
            <p className="text-dispatch-dim text-sm">Dedicated technical account management with response SLAs.</p>
          </div>
          <div className="border border-dispatch-line rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Co‑marketing</div>
            <p className="text-dispatch-dim text-sm">Case studies, joint webinars, and featured listings on our partner page.</p>
          </div>
          <div className="border border-dispatch-line rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Insights</div>
            <p className="text-dispatch-dim text-sm">Access to anonymised performance data and benchmarking reports.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to accelerate your mobility offering?</h2>
        <p className="text-dispatch-dim mb-6">
          Join a growing ecosystem of partners who are transforming how people and goods move.
        </p>
        <Button size="lg" onClick={openModal}>
          Start the conversation
        </Button>
      </div>

      {/* Partnership inquiry modal - two columns on large screens */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-dispatch-panel border border-dispatch-line rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dispatch-panel border-b border-dispatch-line px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Partnership inquiry</h2>
              <button
                onClick={closeModal}
                className="text-dispatch-dim hover:text-dispatch-text text-2xl leading-none"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-dispatch-dim mb-1">Company name *</label>
                    <Input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Your company"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dispatch-dim mb-1">Contact name</label>
                    <Input
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dispatch-dim mb-1">Email *</label>
                    <Input
                      name="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dispatch-dim mb-1">Integration type</label>
                    <select
                      name="integrationType"
                      value={form.integrationType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
                    >
                      <option value="">Select…</option>
                      <option value="api">API Integration</option>
                      <option value="rideshare">Rideshare</option>
                      <option value="fleet">Fleet Management</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-dispatch-dim mb-1">Nature of collaboration</label>
                    <Input
                      name="nature"
                      value={form.nature}
                      onChange={handleChange}
                      placeholder="e.g., integration with our logistics platform"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dispatch-dim mb-1">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none"
                      placeholder="Tell us about your project or idea…"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      name="callRequested"
                      id="callRequested"
                      checked={form.callRequested}
                      onChange={handleChange}
                      className="w-4 h-4 accent-dispatch-accent"
                    />
                    <label htmlFor="callRequested" className="text-sm text-dispatch-dim">
                      I’d like a short call to discuss this further.
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-4 border-t border-dispatch-line">
                <Button variant="secondary" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Send inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}