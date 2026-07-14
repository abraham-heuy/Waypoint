import ProductPage from "./productspage";

export default function RouteOptimizerPage() {
  return (
    <ProductPage
      title="Route Optimizer"
      subtitle="The engine that powers your best route"
      description="Our core optimization engine combines exact algorithms for small stop counts with heuristic solvers for larger fleets. It handles real-world constraints like time windows, vehicle capacity, and traffic conditions, delivering routes that save time, fuel, and frustration."
      features={[
        'Exact Held-Karp solver for optimal ordering up to ~15 stops',
        'OR-Tools heuristic solver for 15+ stops – near-optimal in milliseconds',
        'Real drive-time data and live traffic integration',
        'Supports time windows, vehicle types, and multi-modal legs',
        'Rideshare fallback for any leg of a route',
      ]}
      benefits={[
        'Always get the shortest, fastest route – no guesswork',
        'Scale from a few errands to hundreds of deliveries',
        'Reduce fuel costs and vehicle wear',
        'Improve on-time delivery and customer satisfaction',
      ]}
    />
  );
}