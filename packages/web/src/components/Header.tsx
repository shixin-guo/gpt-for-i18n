import Link from 'next/link';
import { Dancing_Script } from 'next/font/google';
import { getServerSession } from 'next-auth/next';

const Dancing_Script_Font = Dancing_Script({
  weight: '400',
  preload: false,
});

import { siteConfig } from '@/config/site';
import { SettingsMenu } from '@/app/(1_Main)/_components/SettingsDropdown';
import { AuthModal } from '@/components/AuthModal';
import { authOptions } from '@/lib/auth';

export async function Header() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <header className="border-slate-6 sticky top-0 z-20 border-b bg-transparent px-4 backdrop-blur-lg">
      <nav
        className="container mx-auto flex items-center  justify-between px-6 py-4 lg:px-8 lg:py-0"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/translator" className="-m-1.5 p-1.5">
            <span className="sr-only">{siteConfig.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={`${Dancing_Script_Font.className} hidden text-4xl sm:inline-block`}
              >
                {siteConfig.name}
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden py-2 lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-5">
          {user && (
            <Link href="/billing" className="-m-1.5 p-1.5">
              <span className="sr-only">{'billing'}</span>
              <div className="flex gap-2">
                <span
                  className={
                    'hover:text-foreground/100 text-muted-foreground hidden text-base font-medium transition-colors sm:inline-block'
                  }
                >
                  billing
                </span>
              </div>
            </Link>
          )}
          <Link href="/pricing" className="-m-1.5 p-1.5">
            <span className="sr-only">{'billing'}</span>
            <div className="flex gap-2">
              <span
                className={
                  'hover:text-foreground/100 text-muted-foreground hidden text-base font-medium transition-colors sm:inline-block'
                }
              >
                pricing
              </span>
            </div>
          </Link>
          {user ? <SettingsMenu session={session} /> : <AuthModal />}
        </div>
      </nav>
    </header>
  );
}
