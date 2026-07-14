import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface ProductPageProps {
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  benefits?: string[];
  ctaText?: string;
  ctaLink?: string;
  children?: ReactNode;
}

export default function ProductPage({
  title,
  subtitle,
  description,
  features,
  benefits,
  ctaText = 'Get started',
  ctaLink = '/get-started',
  children,
}: ProductPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-dispatch-dim text-lg">{subtitle}</p>}
      </div>

      <div className="prose prose-invert max-w-none text-dispatch-dim leading-relaxed space-y-6">
        <p className="text-lg">{description}</p>

        <h2 className="text-2xl font-semibold text-dispatch-text mt-8">Features</h2>
        <ul className="list-disc list-inside space-y-2">
          {features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>

        {benefits && benefits.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-dispatch-text mt-8">Benefits</h2>
            <ul className="list-disc list-inside space-y-2">
              {benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </>
        )}

        {children && <div className="mt-8">{children}</div>}

        <div className="mt-12">
          <Link to={ctaLink}>
            <Button size="lg">{ctaText}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}