import { useEffect, useImperativeHandle, useRef } from 'react';
import type { Ref } from 'react';
import { withBaseHead } from '../utils/previewDocument';

// Live preview for HTML/CSS problems -- the in-browser equivalent of VS Code's
// Live Server. The student's code goes into an iframe's srcdoc and is
// re-rendered a moment after they stop typing.
//
// sandbox="allow-same-origin" *without* allow-scripts is the whole security
// model here:
//   - no script in the student's page runs -- not <script>, not onerror=,
//     not javascript: URLs -- so the page can't touch the app, the session,
//     or anything else, even though it shares our origin;
//   - sharing the origin is what lets the grader read contentDocument and
//     getComputedStyle from outside (webChecks.ts).
// Dropping allow-same-origin would make the page unreadable; adding
// allow-scripts alongside it would let the page remove its own sandbox.
// Never add allow-scripts.
//
// srcdoc documents inherit the app's CSP, so external images are blocked by
// img-src the same way they are for the app itself, and frame-src 'none' does
// not apply to srcdoc (verified in Chrome).

export interface WebPreviewHandle {
  /** Renders `code` now (skipping the debounce) and resolves with the loaded document. */
  render: (code: string) => Promise<Document>;
}

interface WebPreviewProps {
  code: string;
  debounceMs?: number;
  ref?: Ref<WebPreviewHandle>;
}

export default function WebPreview({ code, debounceMs = 300, ref }: WebPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // What the iframe currently shows, so render() can skip a reload (and its
  // flash) when the debounced update already caught up.
  const loadedRef = useRef<string | null>(null);

  const load = (next: string) =>
    new Promise<Document>((resolve, reject) => {
      const iframe = iframeRef.current;
      if (!iframe) return reject(new Error('미리보기가 준비되지 않았어요.'));
      if (loadedRef.current === next && iframe.contentDocument?.readyState === 'complete') {
        return resolve(iframe.contentDocument);
      }
      const onLoad = () => {
        iframe.removeEventListener('load', onLoad);
        loadedRef.current = next;
        const doc = iframe.contentDocument;
        if (doc) resolve(doc);
        else reject(new Error('미리보기를 읽을 수 없어요.'));
      };
      iframe.addEventListener('load', onLoad);
      // An unchanged srcdoc doesn't reload, which would leave the promise
      // hanging; the trailing comment forces a distinct value only then.
      const srcdoc = withBaseHead(next);
      iframe.srcdoc = iframe.srcdoc === srcdoc ? `${srcdoc}\n<!-- -->` : srcdoc;
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      load(code).catch(() => {});
    }, loadedRef.current === null ? 0 : debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, debounceMs]);

  useImperativeHandle(ref, () => ({ render: load }));

  return (
    <iframe
      ref={iframeRef}
      title="미리보기"
      sandbox="allow-same-origin"
      style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff', display: 'block' }}
    />
  );
}
