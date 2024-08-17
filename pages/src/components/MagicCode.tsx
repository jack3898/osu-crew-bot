import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";

export function MagicCode(): ReactElement {
  const [label, setLabel] = useState("📋 copy");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(textareaRef.current!.value);

    setLabel("✅ copied");

    const timeout = setTimeout(() => {
      setLabel(label);
    }, 5000);

    return (): void => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code || !state) {
      textareaRef.current!.textContent = "Invalid code or state";

      return;
    }

    textareaRef.current!.textContent = `${btoa(code)}:${btoa(state)}`;
  }, []);

  return (
    <div className="flex flex-col items-start gap-1">
      <textarea
        id="oauth-code"
        className="block p-1 rounded bg-zinc-700 text-white border-none max-w-96 w-full resize-none"
        rows={6}
        disabled
        ref={textareaRef}
      ></textarea>
      <button
        type="button"
        aria-label="Copy code to clipboard"
        onClick={copyCode}
        id="oauth-code-button"
        className="rounded border-none p-1 bg-zinc-700 text-white cursor-pointer"
      >
        {label}
      </button>
    </div>
  );
}
