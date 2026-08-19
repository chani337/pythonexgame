import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { indentUnit } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';

export type EditorLanguage = 'python' | 'sql' | 'java' | 'js';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: EditorLanguage;
  placeholder?: string;
  disabled?: boolean;
  onSubmitShortcut?: () => void;
  fontSize?: string;
}

function getLanguageExtension(language: EditorLanguage) {
  switch (language) {
    case 'sql':
      return sql();
    case 'java':
      return java();
    case 'js':
      return javascript();
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
}: CodeEditorProps) {
  const extensions = useMemo(
    () => [
      getLanguageExtension(language),
      indentUnit.of('    '),
      // Block paste/drop entirely (typing-practice / anti-copy-paste policy),
      // matching the previous plain-textarea editor's behavior. Blocking the
      // native paste/drop DOM events covers keyboard paste, right-click paste,
      // and IME edge cases uniformly (no need to special-case key combos).
      EditorView.domEventHandlers({
        paste: (event) => {
          event.preventDefault();
          return true;
        },
        drop: (event) => {
          event.preventDefault();
          return true;
        },
      }),
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
    [language, onSubmitShortcut]
  );

  return (
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
  );
}
