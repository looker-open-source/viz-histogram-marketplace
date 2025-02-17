let path = require("path");

let webpackConfig = {
  mode: "production",
  entry: {
    histogram: "./src/histogram.js",
  },
  devServer: {
    contentBase: __dirname,
  },
  output: {
    filename: "bundle.js",
    path: path.join(path.resolve(__dirname), "/dist"),
    library: "[name]",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{loader: "style-loader"}, {loader: "css-loader"}],
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/,
        use: [{loader: "url-loader"}],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
    modules: [path.join(__dirname, "../src"), "node_modules"],
  },
};

module.exports = webpackConfig;
