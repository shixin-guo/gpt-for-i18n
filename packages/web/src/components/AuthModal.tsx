'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
interface Props {
  show?: boolean;
  onClose?: () => void;
  slot?: React.ReactNode;
}
export const AuthModal: FC<Props> = ({
  slot = <Button variant="outline">Log in</Button>,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<null | string>();
  const signInWithGoogle = (): void => {
    // toast.loading('Redirecting...');
    setIsLoading(true);
    setLoginType('google');
    // Perform sign in
    signIn('google', {
      callbackUrl: window.location.href,
    });
  };
  // const signInWithTwitter = (): void => {
  //   // toast.loading('Redirecting...');
  //   setIsLoading(true);
  //   setLoginType('twitter');
  //   // Perform sign in
  //   signIn('twitter', {
  //     callbackUrl: window.location.href,
  //   });
  // };

  const signInWithGithub = (): void => {
    // toast.loading('Redirecting...');
    setIsLoading(true);
    setLoginType('github');
    // Perform sign in
    signIn('github', {
      callbackUrl: window.location.href,
    });
  };

  return (
    <Dialog>
      {/* <Button variant="outline">Log in</Button> */}
      <DialogTrigger asChild>{slot}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
        </DialogHeader>
        <div className="text-lg">
          <button
            onClick={() => signInWithGithub()}
            disabled={isLoading}
            className="mx-auto mt-4 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border p-2 text-gray-500  hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <Image
              src="/github.svg"
              alt="Github"
              width={32}
              height={32}
              className="rounded-full border bg-white"
            />
            <span>Github</span>
            {isLoading && loginType === 'github' && (
              <Icons.spinner className="absolute left-6 mr-2 animate-spin" />
            )}
          </button>

          <button
            onClick={() => signInWithGoogle()}
            disabled={isLoading}
            className="mx-auto mt-4 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border p-2 text-gray-500  hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={32}
              height={32}
              className="rounded-full border bg-white"
            />
            <span>Google</span>
            {isLoading && loginType === 'google' && (
              <Icons.spinner className=" absolute left-6 mr-2 animate-spin" />
            )}
          </button>
          {/* <button
            onClick={() => signInWithTwitter()}
            disabled={isLoading}
            className="mx-auto mt-4 flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border p-2 text-gray-500  hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={32}
              height={32}
              className="rounded-full border bg-white"
            />
            <span>Twitter</span>
            {isLoading && loginType === 'google' && (
              <Icons.spinner className=" absolute left-6 mr-2 animate-spin" />
            )}
          </button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
