const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  plugins: [
    new CleanWebpackPlugin(["static"]),
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
    path: path.resolve(__dirname, "static")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!copy-text-to-clipboard)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
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
