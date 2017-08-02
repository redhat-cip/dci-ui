const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const entryObj = glob.sync("./src/**/*.test.js").reduce((acc, file) => {
  acc[file.replace("./", "").replace(/\//g, "_")] = file;
  return acc;
}, {});

module.exports = {
  target: "node",
  entry: entryObj,
  output: {
    path: path.resolve(__dirname, "test", "_build"),
    filename: "[name]"
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
};
