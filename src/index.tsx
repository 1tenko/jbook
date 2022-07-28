import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import * as esbuild from "esbuild-wasm";

const App = () => {
  const ref = useRef<any>();

  const [input, setInput] = useState("");
  // output from ESBuild
  const [code, setCode] = useState("");

  const startService = async () => {
    try {
      ref.current = await esbuild.initialize({
        worker: true,
        wasmURL: "/esbuild.wasm",
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
      const res = await esbuild.transform(input, {
        loader: "jsx",
        target: "es2015",
      });
      setCode(res.code);
    } catch (error) {
      console.error(error);
    }
  };

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
    </div>
  );
};

export default App;

ReactDOM.render(<App />, document.querySelector("#root"));
