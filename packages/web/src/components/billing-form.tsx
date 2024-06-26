'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { UserSubscriptionPlan } from '@/types/types';
import { cn, formatDate } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Pricing } from '@/config/pricing';
interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: UserSubscriptionPlan & {
    isCanceled: boolean;
  };
  usage: number;
}

export function BillingForm({
  subscriptionPlan,
  usage,
  className,
  ...props
}: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: any) {
    event.preventDefault();
    setIsLoading(!isLoading);

    // Get a Stripe session URL.
    const response = await fetch('/api/users/stripe');
    if (!response?.ok) {
      return toast('Something went wrong.', {
        position: 'top-center',
      });
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = await response.json();
    if (session) {
      window.location.href = session.url;
    }
  }

  return (
    <form className={cn(className)} onSubmit={onSubmit} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div>
              <span>Subscription Plan</span>
              <span className="float-right">
                Usage: {usage} /{' '}
                {subscriptionPlan.isPro
                  ? Pricing.Pro.tokenLimit
                  : Pricing.Free.tokenLimit}
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{' '}
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent>{subscriptionPlan.description}</CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {subscriptionPlan.isPro ? 'Manage Subscription' : 'Upgrade to PRO'}
          </button>
          {subscriptionPlan.isPro ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? 'Your plan will be canceled on '
                : 'Your plan renews on '}
              {formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </form>
  );
}
