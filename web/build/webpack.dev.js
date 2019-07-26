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
    // 实现刷新浏览器webpack-hot-middleware/client?noInfo=true&reload=true 是必填的
    // webpack-hot-middleware/client?noInfo=true&reload=true
    path.resolve(__dirname, "../static/src/index.jsx")
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "../static/dist"),
    compress: true,
    host: "localhost",
    port: 8080,
    // quiet: true,
    // 重要，关于热加载的细节 https://github.com/webpack/docs/wiki/webpack-dev-server#content-base
    hot: true,
    inline: true,
    // watchOptions: {
    //   ignored: /node_modules/
    // },
    historyApiFallback: true
  },
  plugins: [
    // 插件
    new webpack.NamedModulesPlugin(), //用于启动HMR时可以显示模块的相对路径
    new BundleAnalyzerPlugin({ analyzerPort: 8081, openAnalyzer: false }),
    new webpack.DefinePlugin({
      'process.env': {
        VUEP_BASE_URL: '/'
      }
    })
  ],
  output: {
    path: path.resolve(__dirname, "../static/dist"),
    filename: "[name].js",
    chunkFilename: "[name].js"
  }
};

module.exports = merge(commonConfig, devConfig);
