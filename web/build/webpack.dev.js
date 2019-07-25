const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const devConfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  entry: [
    "react-hot-loader/patch",
    path.resolve(__dirname, "../static/src/index.jsx")
  ],
  optimization: {
    usedExports: true
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../static/dist"),
    compress: true,
    port: 9090,
    hot: true,
    inline: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true
  },
  plugins: [
    // 插件
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin({ analyzerPort: 9091, openAnalyzer: false })
  ],
  output: {
    filename: "[name].js",
    chunkFilename: "[name].js"
  }
};

module.exports = merge.smart(commonConfig, devConfig);
