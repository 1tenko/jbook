import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import { bundle } from './bundler';

const App = () => {
  const ref = useRef<any>();

  const [code, setCode] = useState('');

  const [input, setInput] = useState('');

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default App;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
