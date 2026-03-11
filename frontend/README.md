# ChangingRoom — Virtual Try-On

Upload a photo of yourself and a clothing item. Gemini generates a photorealistic image of you wearing it.

## Running the app

**1. Add your Gemini API key**

Create a file called `.env.local` in this directory:

```
GOOGLE_AI_API_KEY=your_key_here
```

Get a key at [aistudio.google.com](https://aistudio.google.com). This file is gitignored — it never gets committed.

**2. Install dependencies**

```bash
npm install
```

**3. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Files

| File | What it does |
|---|---|
| `app/page.tsx` | Home page — renders the upload form |
| `app/layout.tsx` | Wraps every page in `<html><body>` |
| `app/globals.css` | Loads Tailwind CSS |
| `app/api/tryon/route.ts` | Server-side API — receives images, calls Gemini, returns result |
| `components/UploadForm.tsx` | Handles file selection, previews, and the fetch call |
| `components/ResultDisplay.tsx` | Renders the spinner, result image, or error |
| `.env.local` | Your Gemini API key (create this yourself — never commit it) |
