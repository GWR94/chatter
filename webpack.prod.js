const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const common = require("./webpack.common");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),
  ],
  // externals: [nodeExternals()],
  node: {
    global: true,
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      http: require.resolve("stream-http"),
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert/"),
      fs: false,
      net: false,
    },
  },
  optimization: {
    runtimeChunk: "single",
    // splitChunks: {
    //   chunks: "all",
    //   maxInitialRequests: Infinity,
    //   minSize: 0,
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module) {
    //         const packageName = module.context.match(
    //           /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
    //         )[1];
    //         return `npm.${packageName.replace("@", "")}`;
    //       },
    //     },
    //     styles: {
    //       name: "styles",
    //       test: /\.css$/,
    //       chunks: "all",
    //       enforce: true,
    //     },
    //   },
    // },
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
        exclude: path.join(__dirname, "node_modules"),
      },
    ],
  },
});
