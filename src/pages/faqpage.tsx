import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  label: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'accounts',
    label: 'Accounts',
    items: [
      {
        id: 'acc-1',
        question: 'How do I create a Waypoint account?',
        answer: 'You can create an account by clicking "Get started" on the homepage and filling in your name, email, and password. You will receive a confirmation email to verify your address.',
      },
      {
        id: 'acc-2',
        question: 'Can I delete my account?',
        answer: 'Yes. You can delete your account from the settings page. This will remove your personal data and route history. Deletion is permanent and cannot be undone.',
      },
      {
        id: 'acc-3',
        question: 'What happens to my routes if I change plans?',
        answer: 'Your routes are always saved. Downgrading may affect the number of routes you can run in a month, but your history remains accessible.',
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    items: [
      {
        id: 'usr-1',
        question: 'Who can use Waypoint?',
        answer: 'Waypoint is designed for delivery drivers, errand runners, trip planners, and small teams. Anyone who needs to plan multi‑stop routes can benefit.',
      },
      {
        id: 'usr-2',
        question: 'Can I share my account with team members?',
        answer: 'Yes. The Team plan allows you to add multiple users to your account, each with their own credentials and route history.',
      },
      {
        id: 'usr-3',
        question: 'What is the difference between a solo and a team account?',
        answer: 'A solo account is for individual users. A team account adds user management, shared routes, and performance tracking across the team.',
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    items: [
      {
        id: 'fb-1',
        question: 'How do I report a bug or suggest a feature?',
        answer: 'Use the feedback form in the app or email us at support@waypoint.com. We review every suggestion and prioritise based on user impact.',
      },
      {
        id: 'fb-2',
        question: 'How do I rate a route or give feedback on Jezza?',
        answer: 'After completing a route, you can rate it and leave feedback. This helps us improve our algorithms and Jezza AI.',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    items: [
      {
        id: 'bill-1',
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, Mastercard, American Express) and PayPal. For enterprise plans, we also support invoicing.',
      },
      {
        id: 'bill-2',
        question: 'Can I cancel my subscription at any time?',
        answer: 'Yes. You can cancel your subscription from your billing settings. Your plan remains active until the end of the current billing period.',
      },
      {
        id: 'bill-3',
        question: 'Do I get a refund if I cancel early?',
        answer: 'We do not provide refunds for partially used subscription periods. However, you will retain access until the end of your paid period.',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    items: [
      {
        id: 'sec-1',
        question: 'How is my data protected?',
        answer: 'We use industry‑standard encryption (TLS) for data in transit, and we hash passwords with bcrypt. We also comply with GDPR and other privacy regulations.',
      },
      {
        id: 'sec-2',
        question: 'Does Waypoint store my credit card details?',
        answer: 'No. All payment processing is handled by our secure payment partners (Stripe/PayPal). We never store your full credit card details on our servers.',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Jezza',
    items: [
      {
        id: 'ai-1',
        question: 'What is Jezza, and how does it work?',
        answer: 'Jezza is our AI assistant that parses natural language into structured routes. You describe your day, and Jezza extracts stops, time windows, and optimises the order.',
      },
      {
        id: 'ai-2',
        question: 'Can I trust Jezza’s suggestions?',
        answer: 'Yes. Jezza explains every change it makes, so you can understand the reasoning. You can always override any suggestion manually.',
      },
      {
        id: 'ai-3',
        question: 'Does Jezza learn from my routes?',
        answer: 'Yes, Jezza learns your preferences over time – such as favourite stops, typical travel modes, and time preferences – to provide more personalised suggestions.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    items: [
      {
        id: 'prod-1',
        question: 'What products does Waypoint offer?',
        answer: 'We offer Route Optimizer, Jezza AI, Task Insights, Maps Integration, and Cost Computation. Each is designed to complement the others for a complete workflow.',
      },
      {
        id: 'prod-2',
        question: 'Do I need all products?',
        answer: 'Not necessarily. You can start with Route Optimizer and add other products as your needs grow. All products work seamlessly together.',
      },
      {
        id: 'prod-3',
        question: 'Are there discounts for using multiple products?',
        answer: 'Yes. Our plans bundle the products with volume discounts. Check the Pricing page for the most up‑to‑date offers.',
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('accounts');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const currentCategory = FAQ_DATA.find((c) => c.id === activeCategory);
  const items = currentCategory?.items || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Frequently asked questions</h1>
      <p className="text-dispatch-dim text-center max-w-2xl mx-auto mb-12">
        Find answers to the most common questions about Waypoint, our products, and how we handle your data.
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar – hidden on mobile, visible on md+ */}
        <aside className="hidden md:block md:w-48 shrink-0">
          <nav className="space-y-1">
            {FAQ_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-mono transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-dispatch-accent/10 text-dispatch-accent border border-dispatch-accentDim'
                    : 'text-dispatch-dim hover:text-dispatch-text hover:bg-dispatch-panel2 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile horizontal chips – visible only on small screens */}
          <div className="md:hidden mb-6 overflow-x-auto">
            <div className="flex flex-nowrap gap-2 py-1">
              {FAQ_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-mono border transition-colors whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-dispatch-accent/20 text-dispatch-accent border-dispatch-accent'
                      : 'text-dispatch-dim border-dispatch-line hover:text-dispatch-text hover:border-dispatch-accentDim'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {items.length === 0 && (
              <p className="text-dispatch-dim text-sm">No questions in this category yet.</p>
            )}
            {items.map((item) => {
              const isExpanded = expandedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-dispatch-line bg-dispatch-panel overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-dispatch-panel2 transition-colors"
                  >
                    <span className="text-sm font-medium">{item.question}</span>
                    <span className="ml-4 flex-shrink-0 text-dispatch-accent text-lg font-mono">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 text-sm text-dispatch-dim leading-relaxed border-t border-dispatch-line pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}