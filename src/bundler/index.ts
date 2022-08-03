import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';

let initialized: boolean = false;

export const bundle = async (rawCode: string) => {
  if (!initialized) {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.51/esbuild.wasm',
    });
    initialized = true;
  }

  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      'process.env.NODE_ENV': "'production'",
      global: 'window',
    },
  });

  return result.outputFiles[0].text;
};
