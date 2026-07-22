"use client"
import { useState, useRef, useCallback } from "react";

const ACCEPTED_EXT = [".csv", ".xls", ".xlsx"];
const MAX_SIZE_MB = 50;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extOf(name) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validateAndSet = useCallback((f) => {
    if (!f) return;
    const ext = extOf(f.name);
    if (!ACCEPTED_EXT.includes(ext)) {
      setError("Unsupported file type. Upload a .csv, .xls, or .xlsx file.");
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      validateAndSet(f);
    },
    [validateAndSet]
  );

  const onBrowse = () => inputRef.current?.click();

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    validateAndSet(f);
    e.target.value = "";
  };

  const badge = file ? extOf(file.name).replace(".", "").toUpperCase() : null;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0b] text-white font-sans antialiased flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-medium tracking-tight text-white">
            Sheetload
          </span>
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            className="text-white/40"
            fill="none"
          >
            <path
              d="M4.5 0L9 4.5L4.5 9L0 4.5L4.5 0Z"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
        <nav className="text-[13px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          History
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-[560px]">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={[
              "relative rounded-2xl bg-[#111113] transition-all duration-200",
              "flex flex-col items-center justify-center text-center",
              "px-10 py-20",
              isDragging
                ? "border border-[#3fa780]/60 bg-[#111113]"
                : "border border-white/[0.07]",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXT.join(",")}
              className="hidden"
              onChange={onInputChange}
            />

            {!file ? (
              <>
                <div
                  className={[
                    "w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors",
                    isDragging ? "bg-[#3fa780]/10" : "bg-white/[0.04]",
                  ].join(" ")}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={isDragging ? "text-[#3fa780]" : "text-white"}
                  >
                    <path
                      d="M12 3v13M12 3l5 5M12 3L7 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 20h16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="text-[15px] font-medium text-white mb-1.5">
                  Drop your file here
                </p>
                <p className="text-[13px] text-white/40 mb-6">
                  or{" "}
                  <button
                    onClick={onBrowse}
                    className="text-white/70 underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white/40 transition-colors"
                  >
                    browse from your computer
                  </button>
                </p>

                <div className="flex items-center gap-2">
                  {["CSV", "XLS", "XLSX"].map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono tracking-wide text-white/35 border border-white/[0.08] rounded-md px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[12px] text-white/25 mt-5">
                  Max file size {MAX_SIZE_MB} MB
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-[#3fa780]/10 flex items-center justify-center mb-6">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#3fa780]"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[15px] font-medium text-white mb-1.5 max-w-[380px] truncate">
                  {file.name}
                </p>
                <p className="text-[13px] text-white/40 mb-6">
                  {formatBytes(file.size)}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono tracking-wide text-[#3fa780] border border-[#3fa780]/25 bg-[#3fa780]/10 rounded-md px-2 py-1">
                    {badge}
                  </span>
                  <button
                    onClick={() => {
                      setFile(null);
                      setError("");
                    }}
                    className="text-[13px] text-white/40 hover:text-white/70 underline underline-offset-4 decoration-white/20 hover:decoration-white/40 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>

          {error && (
            <p className="text-[13px] text-[#e2716a] mt-4 text-center">
              {error}
            </p>
          )}

          {file && !error && (
            <button className="w-full mt-4 rounded-xl bg-white text-[#0a0a0b] text-[14px] font-medium py-3 hover:bg-white/90 transition-colors">
              Continue
            </button>
          )}
        </div>
      </main>
    </div>
  );
}