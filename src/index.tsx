import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import * as esbuild from "esbuild-wasm";

const App = () => {
  const [input, setInput] = useState("");
  // output from ESBuild
  const [code, setCode] = useState("");

  const startService = async () => {
    try {
      await esbuild.initialize({
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

  const onClick = () => {
    console.log(input);
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
