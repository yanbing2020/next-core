const path = require("path");
const webpack = require("webpack");
const changeCase = require("change-case");

module.exports = () => {
  const isProd = process.env.NODE_ENV === "production";
  const dirname = process.cwd();
  const appRoot = path.join(dirname, "..", "..");
  const distPath = path.join(dirname, "dist");

  const packageJson = require(path.join(dirname, "package.json"));
  const { name, dependencies, devDependencies } = packageJson;
  const filename = `dll-of-${name.split("/").slice(-1)[0]}`;

  const dllReferences = [];
  if (devDependencies && devDependencies["@easyops/brick-dll"]) {
    dllReferences.push(
      new webpack.DllReferencePlugin({
        context: appRoot,
        manifest: require("@easyops/brick-dll")
      })
    );
  }

  return {
    context: appRoot,
    devtool: "source-map",
    mode: isProd ? "production" : "development",
    entry: {
      [changeCase.pascal(filename)]: Object.keys(dependencies)
    },
    output: {
      filename: `${filename}.js`,
      path: distPath,
      library: "[name]"
    },
    plugins: [
      ...dllReferences,
      new webpack.DllPlugin({
        name: "[name]",
        path: path.join(distPath, "manifest.json")
      }),
      new webpack.HashedModuleIdsPlugin()
    ],
    resolve: {
      // only resolve .js extension files
      // Note that we does not resolve .json for significantly lower IO requests
      extensions: [".ts", ".js"],
      // modules: [path.join(appRoot, "node_modules")],
      symlinks: false
      // alias: resolverAlias
    },
    performance: {
      hints: false
    }
  };
};