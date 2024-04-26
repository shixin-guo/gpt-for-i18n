import { env } from '@/env.mjs';
const ProjectName = 'LingoSpace';
export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github?: string;
    discord?: string;
  };
};

export const siteConfig: SiteConfig = {
  name: ProjectName,
  description: `${ProjectName} Unlock Global Markets with AI-Powered, Solution for i18n, Speed your FrontEnd UI Translation`,
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    twitter: 'https://twitter.com/lingo_space',
    github: 'https://github.com/shixin-guo/lingo-space-discuss',
    discord: 'https://discord.gg/fGgE6zGT',
  },
};
