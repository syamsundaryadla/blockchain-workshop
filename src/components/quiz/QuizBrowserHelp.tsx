"use client";
import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { chromeJoinIntent } from "@/lib/live-quiz/client";
import { copyToClipboard } from "@/lib/utils";

export function QuizBrowserHelp() {
  const [url, setUrl] = useState(""),
    [android, setAndroid] = useState(false),
    [copied, setCopied] = useState(false),
    [manualCopy, setManualCopy] = useState(false);
  useEffect(() => {
    setUrl(window.location.href);
    setAndroid(/Android/i.test(navigator.userAgent));
  }, []);
  return (
    <aside className="quiz-browser-help" aria-label="Open quiz in your browser">
      <strong>Joining from a QR scanner?</strong>
      <p>
        Some scanners restrict live connections. Open this page in Chrome or
        Safari, then enter your name.
      </p>
      <div className="quiz-actions">
        {android && url && (
          <a
            className="quiz-button quiz-secondary"
            href={chromeJoinIntent(url)}
          >
            <ExternalLink size={15} /> Open in Chrome
          </a>
        )}
        <button
          type="button"
          className="quiz-button quiz-secondary"
          onClick={async () => {
            try {
              const success = await copyToClipboard(url);
              setCopied(success);
              setManualCopy(!success);
              setTimeout(() => setCopied(false), 2500);
            } catch {
              setCopied(false);
              setManualCopy(true);
            }
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Link copied" : "Copy quiz link"}
        </button>
      </div>
      {manualCopy && <label>Select and copy this link<input aria-label="Quiz link to copy" readOnly value={url} onFocus={event => event.target.select()} /></label>}
      <p className="quiz-browser-instruction">
        You can also use your scanner’s menu → Open in browser.
      </p>
    </aside>
  );
}
