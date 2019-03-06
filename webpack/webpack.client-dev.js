const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const pxtorem = require("postcss-pxtorem");
const cwd = process.cwd();

module.exports = {
  mode: "development",
  entry: {
    app: path.resolve(cwd, "client/app.js"),
    vendor: ["react", "react-dom"]
  },
  stats: "errors-only",
  output: {
    path: path.resolve(cwd, "dist/client"),
    filename: "js/[name].js",
    //HotModuleReplacement.runtime.js：热更新时会把请求前缀设置为这个全局变量$require$.p，经过一番查找定位到代码是通过字符串方式在mainTemplate文件中申明的.p：getPublicPath方法,
    //如果不设置，默认是“/”,这样HotModuleReplacementPlugin在请求更新时会走当前url路径，比如http://localhost:3000/56da44fe1c89fa433faf.hot-update.json
    //而我们的更新数据在5000端口的devserver服务器上，因此这里修改了publicPath，就会走到预期的http://localhost:5000/56da44fe1c89fa433faf.hot-update.json上，
    //但是仍然需要在hmr配置中设置headers允许cors，否则会出现跨域问题
    //https://webpack.js.org/configuration/output/#output-publicpath 这里解释过webpack-dev-server和__webpack_public_path__变量。这是个坑，也是后来解决问题之后才注意到这里的文档。
    publicPath: `http://localhost:${require("../envConfig").devServerPort}/`
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
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), //当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
    new function() {
      this.apply = compiler => {
        //自定义注册钩子函数，watch监听修改并编译完成后，done被触发，callback必须执行，否则不会执行后续流程
        compiler.hooks.done.tap(
          "recomplie_complete",
          (compilation, callback) => {
            console.log("client compile completed");
            callback && callback();
          }
        );
      };
    }()
  ],
  devtool: "inline-source-map"
};
