import { SubscriptionPlan } from '@/types/types';

import { env } from '@/env.mjs';
import { Pricing } from '@/config/pricing';
export const freePlan: SubscriptionPlan = {
  name: 'Free Trail',
  description: `Get started with ${Pricing.Free.tokenLimit} tokens! Upgrade to PRO for a monthly allowance of ${Pricing.Pro.tokenLimit} tokens—unlock more potential.`,
  stripePriceId: '',
};

export const proPlan: SubscriptionPlan = {
  name: 'PRO',
  description: `Enjoy ${Pricing.Pro.tokenLimit} tokens and supercharge your projects!`,
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || '',
};

export const enterprisePlan: SubscriptionPlan = {
  name: 'ENTERPRISE',
  description:
    'Enterprise excellence awaits! Priority support, no limits—unlock the power of unlimited tokens.',
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || '',
};
