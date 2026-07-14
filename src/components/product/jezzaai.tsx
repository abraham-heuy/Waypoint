import ProductPage from "./productspage";

export default function JezzaAiPage() {
  return (
    <ProductPage
      title="Jezza AI"
      subtitle="Your intelligent route planning assistant"
      description="Jezza is an AI-powered assistant that turns natural language into structured routes. Just describe your day, and Jezza will parse stops, optimize the order, and handle time windows. It explains every decision in plain language, so you understand why the route is ordered the way it is."
      features={[
        'Natural language parsing – "pharmacy, then groceries, pick up Sam by 4" becomes a structured route',
        'Real-time re-optimization when you add or remove stops',
        'Transparent reasoning – Jezza explains why it made each change',
        'Integration with your to‑do app – pull in tasks and turn them into routes',
        'Proactive suggestions based on your past preferences',
      ]}
      benefits={[
        'Save time by describing your day instead of manually adding stops',
        'Reduce mental overhead – let the AI handle the planning',
        'Understand the logic behind your route, so you can trust the plan',
        'Seamlessly combine with other Waypoint tools for a complete workflow',
      ]}
      ctaText="Try Jezza AI"
      ctaLink="/get-started"
    />
  );
}