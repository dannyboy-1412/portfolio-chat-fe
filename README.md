This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## TODO
Add header component -done
Add a chatbot component - done
 - Improve the chatbot component mainly its background and make it blend with the background -done
 - Make the chatbot response look like it was being streamed - done
 - Format the chatbot response to be more readable - done
 - ctrl + k or cmd + k to refresh the conversation thread - done
 - Enhance the UI - done
 - Autoscroll to the bottom of the chatbot when a new message is sent - done
 - Add a telegram bot to which the user message and the bot response to me via telegram 
 - Create a cron job on the be to clear messages stored in the db every 30 min

Think about integrating agentic mechanisms for users to reach out to me
- drag and drop components to convert the chatbot into a linkedin chatbot or gmail chatbot such that once the user sends the message via linkedin or gmail, it will send the message to me.