const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    vendor: "./src/vendor.js",
    app: "./src/app.js"
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "static")
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
      {test: /\.html$/, loader: "raw-loader"},
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
  plugins: [
    new CleanWebpackPlugin('static'),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ExtractTextPlugin("[name].[contenthash].css"),
    new CopyWebpackPlugin([{context: "./src", from: "config.js", to: ""}]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.WatchIgnorePlugin(['./src/config.js'])
  ]
};
