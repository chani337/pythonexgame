// Lightweight obfuscation so problem answers aren't plainly readable by
// scanning the bundled source (e.g. a quiz's correct option sitting right
// next to the option list in plain text). This is NOT real security -- the
// bundle is still fully downloadable and anyone willing to call atob() can
// decode it -- it just removes the "grep the JS file, see the answer"
// shortcut for a casual look.
export function decodeAnswer(encoded: string): string {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}
