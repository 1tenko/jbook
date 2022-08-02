import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

import { useRef } from 'react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    _monaco: Monaco
  ) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
    if (editorRef.current) {
      // get current value from editor
      const unformatted = editorRef.current.getValue();
      // format the value
      const formatted = prettier.format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      });
      // set the formatted value back in the editor
      editorRef.current.setValue(formatted);
    }
  };

  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
      <Editor
        onMount={onEditorDidMount}
        value={initialValue}
        height="500px"
        theme="vs-dark"
        language="javascript"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
