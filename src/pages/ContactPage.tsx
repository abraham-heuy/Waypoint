import { useState, type FormEvent } from 'react';
import { Input } from '../components/ui/primitives';
import Button from '../components/ui/Button';
import { toast } from '../store/toastStore';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold mb-2">Get in touch.</h1>
      <p className="text-dispatch-dim text-sm mb-8">
        Questions, feedback, or partnership ideas — this goes straight to the team.
      </p>
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
  );
}
