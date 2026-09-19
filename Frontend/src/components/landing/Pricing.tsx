import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PricingProps {
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    credits: '10 credits',
    features: ['10 credits on signup', 'Resume analysis', 'Match score & insights', 'AI optimization agent'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    credits: '100 credits / month',
    features: ['100 credits per month', 'Unlimited resume uploads', 'Priority AI processing', 'Detailed recommendations', 'Export optimized LaTeX'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$49',
    credits: '300 credits / month',
    features: ['300 credits per month', 'Team shared credits', 'Bulk analysis', 'Priority support', 'Custom LaTeX templates'],
    cta: 'Contact Us',
    highlighted: false,
  },
];

export function Pricing({ onNavigate }: PricingProps) {
  const { notify } = useAuth();

  const handlePlanClick = (planName: string) => {
    if (planName === 'Pro') {
      notify('Upgrade to Pro is coming soon. Payments are currently in test mode.', 'warning');
      return;
    }

    onNavigate('register');
  };

  return (
    <section id="pricing" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Simple, credit-based pricing
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Start free with 10 credits. Upgrade when you need more. No subscriptions required.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative p-8 ${
              plan.highlighted
                ? 'border-brand-300 dark:border-brand-700 shadow-xl shadow-brand-600/10'
                : ''
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-2">
              {plan.highlighted && <Zap className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
              {plan.price !== '$0' && <span className="text-sm text-gray-500">/month</span>}
            </div>
            <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-400">{plan.credits}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.highlighted ? 'primary' : 'outline'}
              className="mt-8 w-full"
              onClick={() => handlePlanClick(plan.name)}
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
