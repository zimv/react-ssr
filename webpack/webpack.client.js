const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pxtorem = require("postcss-pxtorem");
const cwd = process.cwd();

module.exports = {
  mode: "production",
  entry: {
    app: path.resolve(cwd, "client/app.js"),
    vendor: ["react", "react-dom"]
  },
  output: {
    path: path.resolve(cwd, "dist/client"),
    filename: "js/[name].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: path.resolve(cwd, "node_modules"),
        query: {
          presets: ["@babel/env", "@babel/react"],
          plugins: [
            "@babel/plugin-transform-runtime",
            "@babel/plugin-proposal-class-properties"
          ]
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: "style-loader!css-loader!less-loader"
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: "postcss-loader",
        query: {
          plugins: [
            pxtorem({
              rootValue: 20,
              unitPrecision: 5,
              propList: ["*"],
              selectorBlackList: [/^\.nop2r/],
              replace: true,
              mediaQuery: false,
              minPixelValue: 0
            })
          ]
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        loader: "file-loader",
        query: {
          name: "assets/[name]-[hash].[ext]"
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      name: "vendor",
      filename: "vendor.bundle.js"
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_BASE_URL: JSON.stringify(require("../envConfig").baseUrl),
      APP_DEV_SERVER: JSON.stringify(require("../envConfig").devServer)
    }),
    new CleanWebpackPlugin([path.resolve(cwd, "dist/client")], {
      root: path.resolve(cwd)
    })
  ]
};
