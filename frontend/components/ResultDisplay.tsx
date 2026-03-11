"use client";

interface ResultDisplayProps {
  loading: boolean;
  result: string | null; // data URL of the generated image
  error: string | null;
}

export default function ResultDisplay({ loading, result, error }: ResultDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 mt-4">
        {/* Simple CSS spinner — no extra library needed */}
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-zinc-500">Asking Gemini to dress you up…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 max-w-md text-center">
        <strong>Error: </strong>{error}
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Result</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result}
          alt="Virtual try-on result"
          className="max-w-sm w-full rounded-2xl shadow-lg border border-zinc-200"
        />
        <a
          href={result}
          download="tryon-result.png"
          className="text-xs text-indigo-600 underline hover:text-indigo-400"
        >
          Download image
        </a>
      </div>
    );
  }

  return null;
}
