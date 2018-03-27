const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/app.js",
    vendor: "./src/vendor.js"
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  plugins: [
    new CleanWebpackPlugin(["static"]),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    new ExtractTextPlugin("[name].[contenthash].css"),
    new CopyWebpackPlugin([{ context: "./src", from: "config.json", to: "" }]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.WatchIgnorePlugin(["./src/config.json"])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!copy-text-to-clipboard)/,
        loader: "babel-loader"
      },
      {
        test: /(\.css|\.scss)$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!sass-loader",
          publicPath: ""
        })
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!less-loader",
          publicPath: ""
        })
      },
      { test: /\.html$/, loader: "raw-loader" },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        loader: "file-loader?name=[name].[ext]"
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=[name].[ext]"
      }
    ]
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "static")
  }
};
