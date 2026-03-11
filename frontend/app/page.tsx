// This is a Server Component (no "use client" directive).
// It has no interactivity itself — it just renders the layout shell.
// The interactive logic lives inside <UploadForm>, which IS a Client Component.
// Splitting them this way is idiomatic Next.js App Router style.

import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center py-16 px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">ChangingRoom</h1>
        <p className="mt-2 text-zinc-500 text-base">
          Upload your photo + a clothing item and see how it looks on you.
        </p>
      </div>

      {/* The interactive form (Client Component) */}
      <UploadForm />

      {/* Footer */}
      <p className="mt-16 text-xs text-zinc-400">
        Powered by Google Gemini · Phase 1 — Local
      </p>
    </main>
  );
}
