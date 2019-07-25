const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const WebpackBar = require("webpackbar");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const output = {
  publicPath: "/",
  path: path.resolve(__dirname, "../static/dist")
};

const webpackModule = {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules|packages/,
      loader: "babel-loader"
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules|packages/,
      loader: "awesome-typescript-loader"
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader", "postcss-loader"]
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/i,
      use: [
        {
          loader: "url-loader",
          options: { limit: 100 }
        }
      ]
    }
  ]
};

const plugins = [
  new WebpackBar(),
  new FriendlyErrorsWebpackPlugin(),

  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "../static/src/index.html")
  }),
  new webpack.HotModuleReplacementPlugin()
];

// const files = fs.readdirSync(path.resolve(__dirname, "../static/dll"));
// files.forEach(file => {
//   if (/.*\.dll.js/.test(file)) {
//     plugins.push(
//       new AddAssetHtmlWebpackPlugin({
//         // 将dll.js文件自动引入html
//         filepath: path.resolve(__dirname, "../static/dll", file)
//       })
//     );
//   }
//   if (/.*\.manifest.json/.test(file)) {
//     plugins.push(
//       new webpack.DllReferencePlugin({
//         // 当打包第三方库时，会去manifest.json文件中寻找映射关系，如果找到了那么就直接从全局变量(即打包文件)中拿过来用就行，不用再进行第三方库的分析，以此优化打包速度
//         manifest: path.resolve(__dirname, "../static/dll", file)
//       })
//     );
//   }
// });

const resolve = {
  extensions: [".js", ".jsx", ".ts", "tsx", "json"],
  alias: {
    // react hooks hot loader config
    "react-dom": "@hot-loader/react-dom"
  }
};

const performance = {
  hints: false
};

const commonConfig = {
  output,
  module: webpackModule,
  plugins,
  resolve,
  performance
};

module.exports = commonConfig;
