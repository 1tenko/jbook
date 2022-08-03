import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    // build represents the bundling process
    setup(build: esbuild.PluginBuild) {
      // if there are any import/require/exports, figure out where the requested file is

      // handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

      // attempt to load up that file
    },
  };
};
