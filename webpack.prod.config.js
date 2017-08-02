const webpack = require("webpack");
const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.config.js");

module.exports = () => {
  return Merge(CommonConfig, {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: false
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
    ]
  });
};
