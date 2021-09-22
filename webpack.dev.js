const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const isProduction = process.env.NODE_ENV === "production";
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              hmr: true,
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true,
    port: 3000,
  },
});
