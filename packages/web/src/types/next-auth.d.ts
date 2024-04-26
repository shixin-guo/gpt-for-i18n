import { User } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      usage: number;
      stripeCurrentPeriodEnd: string;
      stripeCustomerId: string;
      stripePriceId: string;
      stripeSubscriptionId: string;
    };
  }
}
