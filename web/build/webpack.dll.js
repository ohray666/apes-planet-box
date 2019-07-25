const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: {
    vendors: ["react", "react-dom"]
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../static/dll"),
    library: "[name]"
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.resolve(__dirname, "../static/dll/[name].manifest.json")
    })
  ]
};
