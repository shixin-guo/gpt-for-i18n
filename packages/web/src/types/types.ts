import { User } from '@prisma/client';
export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface TranslateBody {
  inputLanguage?: string;
  outputLanguage: string;
  inputCode: {
    [key: string]: string;
  };
  model?: OpenAIModel;
  usage: number;
}
export interface TranslateMarkdownBody {
  inputLanguage?: string;
  outputLanguage: string;
  inputCode: string;
  model?: OpenAIModel;
  enableOptimize?: boolean;
  usage: number;
}

export interface TranslateResponse {
  code: string;
}

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, 'stripeCustomerId' | 'stripeSubscriptionId'> & {
    stripeCurrentPeriodEnd: number;
    isPro: boolean;
  };
