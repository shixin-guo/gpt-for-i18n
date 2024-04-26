import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Pricing } from '@/config/pricing';
export const metadata = {
  title: 'Pricing',
};

export default function PricingPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Unlock all features including unlimited posts for your blog.
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            What&apos;s included in the PRO plan
          </h3>
          <ul className="text-muted-foreground grid gap-3 text-sm sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" />
              {Pricing.Pro.tokenLimit
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              &nbsp;Tokens
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Premium Support (contract
              us for more)
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> New Features First
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> GPT-4 Support
            </li>
            {/*
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Custom domain
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Dashboard Analytics
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Access to Discord
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> Premium Support
            </li> */}
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            {/* // todo get from stripe */}
            <h4 className="text-7xl font-bold">${Pricing.Pro.price}</h4>
            <p className="text-muted-foreground text-sm font-medium">
              Billed Monthly
            </p>
          </div>
          <Link href="/billing" className={cn(buttonVariants({ size: 'lg' }))}>
            Get Started
          </Link>
        </div>
      </div>
      <div className="text-center">
        <span className="text-muted-foreground">
          * More features coming soon
        </span>
      </div>
    </section>
  );
}
