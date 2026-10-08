// The app's own typefaces (index.html / src/index.css), so the preview looks
// like the site around it instead of the browser default (Times, and
// whatever Hangul the OS has). Same URLs as index.html, so they come from the
// HTTP/service-worker cache the app already filled.
//
// Prepended, not inserted after the doctype: srcdoc documents are always
// no-quirks, so content before <!DOCTYPE> can't change the rendering mode,
// and the parser hoists these tags into <head> -- body selectors, :nth-child
// and the grader never see them. :where() keeps specificity at zero, so any
// font-family the student writes, even on `*`, wins.
const BASE_HEAD = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css">',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Nanum+Gothic+Coding:wght@400;700&display=swap">',
  "<style>:where(html){font-family:'Pretendard Variable',Pretendard,'Inter',system-ui,-apple-system,sans-serif}:where(code,pre,kbd,samp){font-family:'JetBrains Mono','Nanum Gothic Coding',monospace}</style>",
].join('');

export const withBaseHead = (code: string) => BASE_HEAD + code;
