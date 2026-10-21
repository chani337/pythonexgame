import { useEffect, useMemo, useRef, useState } from 'react';
import { isShortPaste, SHORT_PASTE_MAX } from '../utils/pastePolicy';
import type { PastePolicy } from '../utils/pastePolicy';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';

export type EditorLanguage = 'python' | 'sql' | 'java' | 'js' | 'html';


interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: EditorLanguage;
  placeholder?: string;
  disabled?: boolean;
  onSubmitShortcut?: () => void;
  fontSize?: string;
  pastePolicy?: PastePolicy;
}

function getLanguageExtension(language: EditorLanguage) {
  switch (language) {
    case 'sql':
      return sql();
    case 'java':
      return java();
    case 'js':
      return javascript();
    case 'html':
      return html();
    default:
      return python();
  }
}

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  placeholder,
  disabled,
  onSubmitShortcut,
  fontSize = '0.85rem',
  pastePolicy = 'short',
}: CodeEditorProps) {
  // Refused pastes used to be dropped silently, which reads as a broken
  // editor. Say why, briefly.
  const [notice, setNotice] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const showNotice = () => {
    setNotice(true);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(false), 3500);
  };
  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  // Read through a ref so the extensions below don't rebuild every render.
  const showNoticeRef = useRef(showNotice);
  showNoticeRef.current = showNotice;

  const extensions = useMemo(
    () => [
      getLanguageExtension(language),
      indentUnit.of('    '),
      // Markup reads fine wrapped, and one long line otherwise scrolls the
      // whole editor sideways and hides every tag's start. Code languages
      // keep no-wrap so indentation stays visibly meaningful.
      ...(language === 'html' ? [EditorView.lineWrapping] : []),
      // Handling the native paste/drop events covers keyboard paste,
      // right-click paste and IME edge cases uniformly. Returning false lets
      // CodeMirror paste normally.
      ...(pastePolicy === 'allow' ? [] : [EditorView.domEventHandlers({
        paste: (event) => {
          if (isShortPaste(event.clipboardData?.getData('text/plain') ?? '')) return false;
          event.preventDefault();
          showNoticeRef.current();
          return true;
        },
        drop: (event) => {
          if (isShortPaste(event.dataTransfer?.getData('text/plain') ?? '')) return false;
          event.preventDefault();
          showNoticeRef.current();
          return true;
        },
      })]),
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onSubmitShortcut?.();
              return true;
            },
          },
          {
            key: 'Shift-Enter',
            run: () => {
              onSubmitShortcut?.();
              return true;
            },
          },
        ])
      ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, onSubmitShortcut, pastePolicy]
  );

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', minWidth: 0 }}>
    <CodeMirror
      value={value}
      height="100%"
      theme={oneDark}
      extensions={extensions}
      onChange={onChange}
      placeholder={placeholder}
      editable={!disabled}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: true,
        closeBrackets: true,
      }}
      style={{ height: '100%', width: '100%', minWidth: 0, fontSize }}
    />
    {notice && (
      <div
        role="status"
        style={{
          position: 'absolute',
          left: '0.75rem',
          right: '0.75rem',
          bottom: '0.75rem',
          zIndex: 5,
          padding: '0.6rem 0.8rem',
          background: '#ffffff',
          border: '1px solid #1a1a1a',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: '#1a1a1a',
        }}
      >
        <strong style={{ fontWeight: 700 }}>문제는 직접 타이핑해야 실력이 늘어요.</strong>{' '}
        한 줄짜리 짧은 내용({SHORT_PASTE_MAX}자까지)은 붙여넣을 수 있어요.
      </div>
    )}
    </div>
  );
}
