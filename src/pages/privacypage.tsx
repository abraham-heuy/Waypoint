import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-dispatch-dim text-sm mb-8">Last updated: July 2026</p>

      <div className="prose prose-invert max-w-none text-dispatch-dim leading-relaxed space-y-6">
        <p>
          At Waypoint, we respect your privacy and are committed to protecting your personal data.
          This policy explains how we collect, use, and safeguard your information when you use our
          route optimization and planning services.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">1. Data we collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Account data</strong> – name, email address, passwords and billing information
            (where applicable).
          </li>
          <li>
            <strong>Route data</strong> – stops, time windows, vehicle type, actual travel times,
            and route preferences (e.g., avoid tolls, prefer highways).
          </li>
          <li>
            <strong>Usage data</strong> – interactions with the platform, AI assistant queries,
            map interactions, and feature usage patterns.
          </li>
          <li>
            <strong>Device and location data</strong> – IP address, browser type, operating system,
            and approximate location (city/region) for regional optimisation.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">2. How we use your data</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To plan and optimize your routes accurately.</li>
          <li>To improve our algorithms and AI models (anonymised data).</li>
          <li>To send you service updates, billing notifications, and relevant tips.</li>
          <li>To personalise your experience and suggest better routes over time.</li>
          <li>To ensure security and prevent fraud or abuse of our platform.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">3. Data sharing and third parties</h2>
        <p>
          We never sell your personal data to third parties. We share data only:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>With mapping providers (e.g., Google Maps) to provide route directions and live traffic.</li>
          <li>With payment processors for billing transactions (we do not store credit card details).</li>
          <li>When required by law, or to protect our legal rights.</li>
          <li>With your explicit consent (e.g., sharing a route with a team member).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">4. AI and algorithmic transparency</h2>
        <p>
          Our AI assistant (Jezza) and route optimisation engine use your stop data to generate routes.
          You can always see the reasoning behind any suggestion or route order. We do not use your data
          for purposes unrelated to route planning, and we do not make automated decisions that significantly
          affect you without human oversight.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">5. Data security</h2>
        <p>
          We use industry‑standard encryption (TLS) for data in transit, and store sensitive data
          (e.g., passwords) using strong hashing. Access to your data is strictly controlled and
          monitored. In the event of a data breach, we will notify affected users within 72 hours
          as required by applicable law.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">6. Your rights</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Access</strong> – you can request a copy of your personal data at any time.</li>
          <li><strong>Correction</strong> – you can update your account information via the dashboard.</li>
          <li><strong>Deletion</strong> – you can request deletion of your account and associated data (certain data may be retained for legal or security reasons).</li>
          <li><strong>Objection</strong> – you can opt out of non‑essential processing (e.g., anonymised analytics).</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at <a href="mailto:privacy@waypoint.com" className="text-dispatch-accent hover:underline">privacy@waypoint.com</a>.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">7. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We also use analytics
          cookies (anonymised) to improve the platform. You can manage cookie preferences in your
          browser settings.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">8. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will notify you via email or an in‑app
          notice for significant changes. The latest version is always available on this page.
        </p>

        <p className="text-sm text-dispatch-dim/60 pt-4">
          If you have any questions, please contact our Data Protection Officer at{' '}
          <a href="mailto:dpo@waypoint.com" className="text-dispatch-accent hover:underline">dpo@waypoint.com</a>.
        </p>
      </div>
    </div>
  );
}