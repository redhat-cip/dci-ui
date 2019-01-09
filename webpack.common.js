const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    new CopyWebpackPlugin([{ context: "./src", from: "config.json", to: "" }]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.WatchIgnorePlugin(["./src/config.json"])
  ],
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader"
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ["file-loader?name=[name].[ext]"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      },
      { test: /\.html$/, loader: "raw-loader" }
    ]
  }
};
