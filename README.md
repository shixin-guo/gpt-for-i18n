<!-- https://egorkonovalov.github.io/flycatcher/posts/3/ -->

# MyLingo
> I18n-translator 

## prisma

```
<!-- npx prisma generate -->
<!-- https://www.prisma.io/docs/data-platform/data-proxy/prisma-cli-with-data-proxyc -->
<!-- npx prisma generate --data-proxy  -->
npx prisma migrate dev
npx prisma db push
npx prisma studio
```






## Features

- NextJS 13 `/app` dir
- AI content generation using **OpenAI**

- Authentication using NextAuth.js
- ORM using **Prisma**
- Database on **Supabase**



## Running locally

1. Install dependencies

```bash
npm i
```

1. Copy `.env.example` to `.env.local` and update the variables.

```bash
cp .env.example .env.local
```

3. Run the project locally

```bash
npm run dev
```


You can clone the pricing model from the above links and make it your own.

## Environment variables

We have considerably reduced the number of environment variables in the project to make it easier for you to get started. This is an exhaustive list of all the environment variables in the project

1. App: `NEXT_PUBLIC_APP_URL` - The is the URL of your application, if you are in the middle of using our deploy button for Vercel, you can open vercel dashboard in another window and visit https://vercel.com/jerric-tier/project-name/settings/domains by replacing `project-name` with yours, make sure to append `https://` to your domain. In local dev mode, you can set this variable in `env.local / env.development` and give it this value `http://localhost:3000`.
2. Auth: `NEXTAUTH_URL` - Used by [Auth.JS](https://authjs.dev/) - When deploying to vercel **you do not have to set this value**, but when you develop you can set this as `http://localhost:3000`. Find more details [here](https://next-auth.js.org/configuration/options#nextauth_url).
3. Auth: `NEXTAUTH_SECRET` - Used by [Auth.JS](https://authjs.dev/) - Used to encrypt JWT and you can easily generate a secret using `openssl rand -base64 32`. Find more details [here](https://next-auth.js.org/configuration/options#nextauth_secret).
4. Github OAuth: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` - Both Client ID and Client Secret of Github App can be generated at your [Github Developer Settings](https://github.com/settings/developers) page and you can read the step-by-step directions [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app). You can provide your `NEXT_PUBLIC_APP_URL` as the Homepage URL and append `/api/auth/callback/github` for the callback URL

6. OpenAI: `OPENAI_API_KEY` - Get your OpenAI API key from [OpenAI User Settings](https://platform.openai.com/account/api-keys)
7. Vercel Storage: `POSTGRES_PRISMA_URL` & `POSTGRES_URL_NON_POOLING` - You will only need these two variables after you have setup your database as we are using Prisma. You can find more details [here](https://vercel.com/docs/storage/vercel-postgres/quickstart).

## Powered by

This example is powered by the following services:


- [OpenAI](https://openai.com/) (AI API)
- [Vercel](https://vercel.com/) (Hosting NextJS)
- [Auth.js](https://authjs.dev/) (Auth)
- [Supabase](https://supabase.com/)  (Database)
- [Stripe](https://stripe.com/) (Payments)

## License

License under the [GPL-3.0 license](/LICENSE.md).
