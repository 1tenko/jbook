import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const ref = useRef<any>();

  const iframe = useRef<any>();

  const [input, setInput] = useState('');
  // output from ESBuild
  const [code, setCode] = useState('');

  const startService = async () => {
    try {
      ref.current = await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.51/esbuild.wasm',
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    try {
      const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          'process.env.NODE_ENV': "'production'",
          global: 'window',
        },
      });

      // console.log(result);
      // setCode(res.outputFiles[0].text);
      iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
    } catch (error) {
      console.error(error);
    }
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe
        ref={iframe}
        title="codeOutput"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

export default App;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
