import ProductPage from "./productspage";

export default function TaskInsightsPage() {
  return (
    <ProductPage
      title="Task Insights"
      subtitle="Understand your performance and improve"
      description="Task Insights gives you a clear view of your route performance over time. Track on‑time delivery rates, average stop duration, feedback scores, and more. Use this data to identify bottlenecks, improve efficiency, and demonstrate your reliability."
      features={[
        'On‑time rate for all completed routes',
        'Average stop duration and idle time analysis',
        'Feedback scores from customers or team members',
        'Route completion trends over days, weeks, or months',
        'Comparison against personal or team benchmarks',
        'Exportable reports for performance reviews',
      ]}
      benefits={[
        'Understand where you are excelling and where you can improve',
        'Set realistic performance goals based on your own data',
        'Show your reliability to clients or employers',
        'Continuously refine your route planning habits',
      ]}
      ctaText="Track your performance"
      ctaLink="/get-started"
    />
  );
}