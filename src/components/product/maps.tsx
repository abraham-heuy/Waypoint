import ProductPage from "./productspage";

export default function MapsIntegrationPage() {
  return (
    <ProductPage
      title="Maps Integration"
      subtitle="Real maps, real directions, real-time"
      description="Waypoint is built on the best mapping technology available. We integrate with Google Maps to provide turn‑by‑turn directions, live traffic updates, and interactive map editing. You can drag stops, add waypoints, and see the impact on your route instantly – all on a familiar, easy‑to‑use map interface."
      features={[
        'Built-in Google Maps integration for reliable directions',
        'Live traffic data – your route adapts to current conditions',
        'Interactive map editing – drag stops, add waypoints, and see changes in real time',
        'Turn‑by‑turn instructions for every leg of your route',
        'Street‑level imagery and satellite view for better context',
        'Offline map support for areas with poor connectivity',
      ]}
      benefits={[
        'Always know the fastest route with real‑time traffic awareness',
        'Visualise your route and make adjustments intuitively',
        'Reduce uncertainty with clear, turn‑by‑turn guidance',
        'Plan with confidence using street‑level detail',
        'Stay on track even in low‑connectivity areas',
      ]}
      ctaText="Explore maps"
      ctaLink="/get-started"
    />
  );
}