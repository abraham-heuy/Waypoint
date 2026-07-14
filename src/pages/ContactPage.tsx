import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/primitives';
import Button from '../components/ui/Button';
import { toast } from '../store/toastStore';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (form.message.trim().length < 10) next.message = 'A few more words would help.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // TODO: replace with a real POST /contact endpoint once available
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
    toast.success('Message sent — we\'ll get back to you soon.');
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Thanks — got it.</h1>
        <p className="text-dispatch-dim text-sm">We usually reply within a day or two.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in touch</h1>
        <p className="text-dispatch-dim text-lg leading-relaxed">
          Whether you have a question about our technology, need support, or simply want
          to share an idea – we are listening. For partnerships, visit our dedicated
          <Link to="/partnerships" className="text-dispatch-accent hover:underline mx-1">
            Partnerships
          </Link>
          page. For careers, head to our
          <Link to="/careers" className="text-dispatch-accent hover:underline mx-1">
            Careers
          </Link>
          page.
        </p>
      </div>

      {/* Scenarios / reasons to contact */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Common reasons to reach out</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/partnerships"
            className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5 text-center hover:border-dispatch-accent/60 transition-colors group"
          >
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Partnerships</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Explore collaboration, API integration, or strategic alliances.
            </p>
            <span className="inline-block mt-3 text-xs text-dispatch-accent group-hover:underline">
              Learn more →
            </span>
          </Link>

          <Link
            to="/careers"
            className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5 text-center hover:border-dispatch-accent/60 transition-colors group"
          >
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Careers</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Interested in joining our team? See open positions and apply.
            </p>
            <span className="inline-block mt-3 text-xs text-dispatch-accent group-hover:underline">
              Explore →
            </span>
          </Link>

          <div
            className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5 text-center cursor-pointer hover:border-dispatch-accent/60 transition-colors group"
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Support</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Need help with your account, a route, or a technical issue?
            </p>
            <span className="inline-block mt-3 text-xs text-dispatch-accent group-hover:underline">
              Contact support →
            </span>
          </div>

          <div
            className="rounded-xl border border-dispatch-line bg-dispatch-panel p-5 text-center cursor-pointer hover:border-dispatch-accent/60 transition-colors group"
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="text-2xl font-bold text-dispatch-accent mb-2">Feedback</div>
            <p className="text-dispatch-dim text-sm leading-relaxed">
              Ideas, feature requests, or criticism – we learn from every input.
            </p>
            <span className="inline-block mt-3 text-xs text-dispatch-accent group-hover:underline">
              Share feedback →
            </span>
          </div>
        </div>
      </div>

      {/* Form and additional info */}
      <div className="grid lg:grid-cols-2 gap-12 items-start" id="contact-form">
        {/* Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={errors.name}
              placeholder="Your name"
            />
            <Input
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              placeholder="you@example.com"
            />
            <div className="w-full">
              <label htmlFor="message" className="block text-xs font-medium text-dispatch-dim mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="What's on your mind?"
                className={`w-full rounded-lg bg-dispatch-panel2 border ${
                  errors.message ? 'border-dispatch-danger' : 'border-dispatch-line'
                } px-3.5 py-2.5 text-sm outline-none focus:border-dispatch-accent transition-colors`}
              />
              {errors.message && <p className="mt-1.5 text-xs text-dispatch-danger">{errors.message}</p>}
            </div>
            <Button type="submit" size="lg" loading={submitting} className="w-full">
              Send message
            </Button>
          </form>
        </div>

        {/* Contact details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dispatch-accent mb-2">
              Email
            </h3>
            <p className="text-dispatch-text">
              <a href="mailto:info@waypoint.com" className="hover:underline">
                info@waypoint.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dispatch-accent mb-2">
              Response time
            </h3>
            <p className="text-dispatch-dim text-sm">
              We aim to reply within 24 hours on business days. For urgent matters,
              please mark your message as “Urgent”.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-dispatch-accent mb-2">
              Follow us
            </h3>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-dispatch-dim hover:text-dispatch-text transition-colors">
                GitHub
              </a>
              <a href="#" className="text-dispatch-dim hover:text-dispatch-text transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-dispatch-dim hover:text-dispatch-text transition-colors">
                X
              </a>
            </div>
          </div>
          <div className="pt-4 border-t border-dispatch-line">
            <p className="text-xs text-dispatch-dim/60">
              We do not share your data with third parties. Your message is confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}