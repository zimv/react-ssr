const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pxtorem = require("postcss-pxtorem");
const cwd = process.cwd();

let lock = false;
module.exports = {
  mode: "development",
  devtool: "none", //"inline-source-map"
  entry: {
    pages: path.resolve(cwd, "client/router/pages.js")
  },
  output: {
    path: path.resolve(cwd, "dist/pages"),
    filename: "[name].js",
    libraryTarget: "umd",
    umdNamedDefine: true
    //HotModuleReplacement.runtime.js：热更新时会把请求前缀设置为这个全局变量$require$.p，经过一番查找定位到代码是通过字符串方式在mainTemplate文件中申明的.p：getPublicPath方法,
    //如果不设置，默认是“/”,这样HotModuleReplacementPlugin在请求更新时会走当前url路径，比如http://localhost:3000/56da44fe1c89fa433faf.hot-update.json
    //而我们的更新数据在5000端口的devserver服务器上，因此这里修改了publicPath，就会走到预期的http://localhost:5000/56da44fe1c89fa433faf.hot-update.json上，
    //但是仍然需要在hmr配置中设置headers允许cors，否则会出现跨域问题
    //https://webpack.js.org/configuration/output/#output-publicpath 这里解释过webpack-dev-server和__webpack_public_path__变量。这是个坑，也是后来解决问题之后才注意到这里的文档。
    //publicPath: 'http://localhost:8000/'
  },
  target: "node",
  externals: [nodeExternals()],
  watch: true,
  watchOptions: {
    ignored: ["**/*.less", "node_modules"] //忽略less，样式修改并不会影响同构
  },
  stats: "errors-only", //只输出错误日志
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
        loader: "to-string-loader!css-loader!less-loader"
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
  plugins: [
    new CleanWebpackPlugin([path.resolve(cwd, "dist/pages")], {
      root: path.resolve(cwd)
    }),
    new webpack.DefinePlugin({
      APP_BASE_URL: JSON.stringify(require("../envConfig").baseUrl),
      APP_DEV_SERVER: JSON.stringify(require("../envConfig").devServer)
    }),
    new function() {
      this.apply = compiler => {
        //自定义注册钩子函数，watch监听修改并编译完成后，done被触发，callback必须执行，否则不会执行后续流程
        compiler.hooks.done.tap(
          "recomplie_complete",
          (compilation, callback) => {
            console.log("server pages-components compile completed");
            if (!lock) {
              require("./webpack.hmr")();
              lock = true;
            }
            callback && callback();
          }
        );
      };
    }()
  ]
};
