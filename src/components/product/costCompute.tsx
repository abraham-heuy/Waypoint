import ProductPage from "./productspage";

export default function CostComputationPage() {
  return (
    <ProductPage
      title="Cost Computation"
      subtitle="Understand the cost of every route"
      description="Waypoint doesn't just find the shortest route – it helps you understand the financial impact of your trips. We compute fuel costs, time costs, and even optional rideshare estimates, so you can make informed decisions about how to move. Whether you're a delivery driver trying to maximize profit, or a traveller budgeting for a trip, our cost tools give you transparency and control."
      features={[
        'Fuel cost estimation based on distance, vehicle type, and current fuel prices',
        'Time cost calculation – value your time with a customizable rate',
        'Rideshare fallback estimates (Uber, Bolt, etc.) for any leg of a route',
        'Total trip cost breakdown, including tolls and parking (where available)',
        'Comparison view – see the cost of different route options side by side',
        'Export cost reports for expense tracking or reimbursement',
      ]}
      benefits={[
        'Plan your budget with accurate cost forecasts',
        'Optimise for cost, not just distance – choose the cheapest or fastest option',
        'Understand the trade‑offs between driving, walking, and rideshare',
        'Maximise profit for delivery drivers and small businesses',
        'Simplify expense reporting with clear cost breakdowns',
      ]}
      ctaText="Start saving"
      ctaLink="/get-started"
    />
  );
}