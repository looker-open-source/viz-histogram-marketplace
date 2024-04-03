var webpackConfig = {
  mode: "production",
  entry: {
    histogram: "./src/histogram.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname,
    library: "[name]",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: ["style-loader", "css-loader"],
      },
      { 
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ],
            plugins: ['@babel/plugin-transform-nullish-coalescing-operator', '@babel/plugin-transform-optional-chaining']
          }
        }
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/,
        loader: "url-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js"],
    modules: ["node_modules"],
  },
};

module.exports = webpackConfig;
