"use client";
// "use client" marks this as a Client Component.
// Client Components can use React hooks (useState, useRef, etc.)
// and browser APIs (FileReader, etc.).
// Server Components cannot — they run only on the server.

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import ResultDisplay from "./ResultDisplay";

// Shape of a successful API response
interface TryOnResult {
  imageUrl: string;
}

// One reusable block that handles a single image slot (person or clothing)
interface ImageSlotProps {
  label: string;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ImageSlot({ label, preview, inputRef, onChange }: ImageSlotProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>

      {/* Clicking the styled div triggers the hidden file input */}
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-48 h-64 rounded-2xl border-2 border-dashed border-zinc-300
                   flex items-center justify-center cursor-pointer overflow-hidden
                   hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-zinc-400 text-xs text-center px-4">
            Click to upload
            <br />
            JPG / PNG / WEBP
          </span>
        )}
      </div>

      {/* The actual file input is invisible — the div above is the UI */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}

export default function UploadForm() {
  // useState stores the selected File objects and their preview URLs
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // useRef gives us a handle to each hidden <input type="file"> DOM node
  const personRef = useRef<HTMLInputElement>(null);
  const clothingRef = useRef<HTMLInputElement>(null);

  // Helper: when a file is selected, store it and generate a preview URL
  function handleFileChange(
    e: ChangeEvent<HTMLInputElement>,
    setFile: (f: File) => void,
    setPreview: (url: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    // URL.createObjectURL creates a temporary in-memory URL for the image
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // prevent full page reload (default HTML form behaviour)
    if (!personFile || !clothingFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // FormData is the browser's way of encoding file uploads for HTTP POST
    const body = new FormData();
    body.append("person", personFile);
    body.append("clothing", clothingFile);

    try {
      // fetch() calls our Next.js API route — the browser never touches Gemini directly
      const res = await fetch("/api/tryon", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        if (data.detail) console.error("Gemini detail:", data.detail);
      } else {
        setResult(data as TryOnResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
        {/* Two image upload slots side by side */}
        <div className="flex gap-10 flex-wrap justify-center">
          <ImageSlot
            label="Your Photo"
            preview={personPreview}
            inputRef={personRef}
            onChange={(e) => handleFileChange(e, setPersonFile, setPersonPreview)}
          />
          <ImageSlot
            label="Clothing Item"
            preview={clothingPreview}
            inputRef={clothingRef}
            onChange={(e) => handleFileChange(e, setClothingFile, setClothingPreview)}
          />
        </div>

        <button
          type="submit"
          disabled={!personFile || !clothingFile || loading}
          className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold
                     hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors text-sm"
        >
          {loading ? "Generating…" : "Try It On"}
        </button>
      </form>

      {/* Show result or error below the form */}
      <ResultDisplay loading={loading} result={result?.imageUrl ?? null} error={error} />
    </div>
  );
}
