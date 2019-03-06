const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pxtorem = require("postcss-pxtorem");
const child_process = require("child_process");
const cwd = process.cwd();
let serverChildProcess = false;
let config = {
  mode: "development",
  devtool: "none", //优化速度
  entry: {
    bundle: path.resolve(cwd, "server/app.js")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(cwd, "dist/server")
  },
  target: "node",
  externals: [nodeExternals()],
  watch: true,
  watchOptions: {
    ignored: ["node_modules", cwd + "/client"], //开发环境忽略client,被dist/pages替代
    aggregateTimeout: 300 //默认值
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
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ["@babel/react"],
          plugins: ["@babel/plugin-proposal-class-properties"]
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
        //服务端渲染需要去掉style-loader,通过react context来获取依赖的组件下的样式,to-string-loader转化为字符串
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
    new webpack.DefinePlugin({
      APP_BASE_URL: JSON.stringify(require("../envConfig").baseUrl),
      APP_DEV_SERVER: JSON.stringify(require("../envConfig").devServer)
    }),
    new CleanWebpackPlugin([path.resolve(cwd, "dist/server")], {
      root: path.resolve(cwd)
    }),
    new function() {
      this.apply = compiler => {
        //自定义注册钩子函数，watch监听修改并编译完成后，done被触发，callback必须执行，否则不会执行后续流程
        compiler.hooks.done.tap(
          "recomplie_complete",
          (compilation, callback) => {
            if (serverChildProcess) {
              console.log("server recomplie completed");
              serverChildProcess.kill();
            }
            serverChildProcess = child_process.spawn("node", [
              path.resolve(cwd, "dist/server/bundle.js"),
              "dev"
            ]);
            serverChildProcess.stdout.on("data", data => {
              console.log(`server out: ${data}`);
            });

            serverChildProcess.stderr.on("data", data => {
              console.log(`server err: ${data}`);
            });
            callback && callback();
          }
        );
      };
    }()
  ]
};
module.exports = config;
