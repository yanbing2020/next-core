const path = require("path");
const webpack = require("webpack");
const {
  dll: { NextDllPlugin, NextHashedModuleIdsPlugin },
} = require("@next-core/webpack-config-factory");
const packageJson = require("./package.json");

const isProd = process.env.NODE_ENV === "production";
const appRoot = path.join(__dirname, "..", "..");
const distPath = path.join(__dirname, "dist");

module.exports = {
  context: appRoot,
  devtool: "source-map",
  mode: isProd ? "production" : "development",
  entry: {
    dll: Object.keys(packageJson.dependencies), //.map(k => k.replace("@next-core/", "@easyops/")),
  },
  output: {
    filename: "[name].js",
    path: distPath,
    library: "[name]",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        // - `rc-editor-mention` (which required `draft-js`) is deprecated in `antd Mentions`
        test: /node_modules\/rc-editor-mention\//,
        use: "null-loader",
      },
    ],
  },
  plugins: [
    new NextDllPlugin({
      name: "[name]",
      path: path.join(distPath, "manifest.json"),
      format: !isProd,
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh|en/),
    new NextHashedModuleIdsPlugin(),
    new webpack.IgnorePlugin({
      // - `esprima` and `buffer` are optional imported by `js-yaml`
      // we don't need them.
      resourceRegExp: /^(?:esprima)$/,
    }),
  ],
  resolve: {
    // only resolve .js extension files
    // Note that we does not resolve .json for significantly lower IO requests
    extensions: [".ts", ".js"],
    // modules: [path.join(appRoot, "node_modules")],
    symlinks: false,
  },
  performance: {
    hints: false,
  },
};
