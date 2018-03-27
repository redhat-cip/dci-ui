const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "source-map",
  plugins: [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
    new UglifyJSPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: false
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor"
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "runtime"
      }),
      new webpack.HashedModuleIdsPlugin(),
  ]
});
