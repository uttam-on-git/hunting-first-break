# hunting-first-break

Personal portfolio site built with React, TypeScript, and Vite, including a lightweight serverless chat endpoint.

## Tech Stack
- React + TypeScript
- Vite
- Vercel Serverless Functions (`api/`)
- Gemini via `@google/genai`

## Run Locally
**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GOOGLE_API_KEY` in `.env.local` to your Gemini API key
3. Start the dev server:
   `npm run dev`

## Build
1. Create a production build:
   `npm run build`
2. Preview the production build:
   `npm run preview`

## Deploy to Vercel
1. Import the repo into Vercel.
2. Use the following settings:
   `npm run build` as the build command
   `dist` as the output directory
3. Add the `GOOGLE_API_KEY` environment variable in Vercel.
4. Deploy.
