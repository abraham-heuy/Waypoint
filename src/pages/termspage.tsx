import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-dispatch-dim text-sm mb-8">Last updated: July 2026</p>

      <div className="prose prose-invert max-w-none text-dispatch-dim leading-relaxed space-y-6">
        <p>
          Welcome to Waypoint. By using our platform, you agree to these terms. If you do not agree,
          please do not use the service.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">1. Acceptance of terms</h2>
        <p>
          These Terms of Service govern your use of Waypoint's website, APIs, mobile applications,
          and associated services. By creating an account or using any part of the platform,
          you accept these terms in full.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">2. User accounts</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You must provide accurate and complete registration information.</li>
          <li>You are responsible for maintaining the confidentiality of your password.</li>
          <li>You are solely responsible for all activity that occurs under your account.</li>
          <li>You must notify us immediately of any unauthorised access or security breach.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">3. Acceptable use</h2>
        <p>You agree not to use Waypoint to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Violate any laws, regulations, or third‑party rights.</li>
          <li>Transmit malicious code or interfere with the service.</li>
          <li>Circumvent any security or rate‑limiting measures.</li>
          <li>Use the platform for unsafe, illegal, or unethical routing (e.g., bypassing emergency services).</li>
          <li>Attempt to reverse‑engineer, decompile, or extract source code from our algorithms without explicit permission.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">4. Intellectual property</h2>
        <p>
          All content, including route optimisation algorithms, AI models, visual designs, and
          documentation, are owned by Waypoint. You may not copy, modify, or redistribute any
          part without written consent. You retain ownership of the stops and routes you input,
          but grant us a non‑exclusive, worldwide license to use them for the purpose of
          providing and improving the service.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">5. AI and route outputs</h2>
        <p>
          Waypoint’s algorithms generate suggestions based on the data you provide. While we strive
          for accuracy, routes may not always reflect real‑world conditions. You are responsible for
          verifying the safety and legality of any route you choose to take. We are not liable for
          any decisions you make based on our outputs.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">6. Billing and subscription</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Some features are free, others require a paid plan. Fees and billing terms are described on our Pricing page.</li>
          <li>All payments are non‑refundable except where required by law.</li>
          <li>We may change pricing with 30 days’ notice.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">7. Data and privacy</h2>
        <p>
          Your data is handled in accordance with our <Link to="/privacy" className="text-dispatch-accent hover:underline">Privacy Policy</Link>.
          You consent to the collection and use of data as described therein.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">8. Termination</h2>
        <p>
          We may suspend or terminate your account at our discretion if you violate these terms.
          You may delete your account at any time via the dashboard. Upon termination, we will
          retain certain data for legal and security purposes.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">9. Disclaimer of warranties</h2>
        <p>
          The platform is provided "as is" and "as available". We do not warrant that the service
          will be uninterrupted, error‑free, or completely secure. Use at your own risk.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">10. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, Waypoint shall not be liable for any indirect,
          incidental, consequential, or punitive damages, including lost profits, data loss, or
          personal injury arising from your use of the platform, even if we have been advised of
          the possibility of such damages.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">11. Governing law</h2>
        <p>
          These terms are governed by the laws of Kenya, without regard to conflict of law principles.
          Any disputes shall be resolved exclusively in the courts of Nairobi, Kenya.
        </p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">12. Changes to these terms</h2>
        <p>
          We may revise these terms from time to time. Changes will be posted on this page, and
          continued use of the service constitutes acceptance of the revised terms.
        </p>

        <p className="text-sm text-dispatch-dim/60 pt-4">
          If you have any questions, please contact us at{' '}
          <a href="mailto:legal@waypoint.com" className="text-dispatch-accent hover:underline">legal@waypoint.com</a>.
        </p>
      </div>
    </div>
  );
}