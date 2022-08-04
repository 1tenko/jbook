import { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
        const handleError = (error) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
          console.error(error);
        };

          window.addEventListener('error', (event) => {
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try{
              eval(event.data);
            } catch (error) {
              handleError(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcDoc = html;
    // setCode(res.outputFiles[0].text);
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
