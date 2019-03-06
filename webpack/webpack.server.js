const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pxtorem = require('postcss-pxtorem');
const child_process = require('child_process');
const cwd = process.cwd();

let config = {
  mode: 'production',
  entry:{
    bundle:path.resolve(cwd,'server/app.js')
  },
  output:{
    filename:'[name].js',
		path: path.resolve(cwd,'dist/server')
  },
  target:'node',
  externals: [nodeExternals()],
  module:{
    rules:[
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test:/\.js$/,
        loader:'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query:{
          presets:['@babel/react'],
          plugins: ["@babel/plugin-proposal-class-properties"]
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader'
      },
      {
        test:/\.less$/,
        exclude: /node_modules/,
        //服务端渲染需要去掉style-loader,通过react context来获取依赖的组件下的样式,to-string-loader转化为字符串
        loader:'to-string-loader!css-loader!less-loader'
      },
      {
        test:/\.less$/,
        exclude: /node_modules/,
        loader: 'postcss-loader',
        query: {
          plugins: [
            pxtorem({
              rootValue: 20,
              unitPrecision: 5,
              propList: ['*'],
              selectorBlackList: [/^\.nop2r/],
              replace: true,
              mediaQuery: false,
              minPixelValue: 0
          })
          ]
        }
      },
      {
        test:/\.html$/,
        loader:'html-loader'
      },
      {
        test:/\.(png|jpg|jpeg|gif)$/i,
        loader:'file-loader',
        query:{
          name:'assets/[name]-[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(cwd,'dist/server')], {root: path.resolve(cwd)}),
    new webpack.DefinePlugin({
      'APP_BASE_URL': JSON.stringify(require('../envConfig').baseUrl),
      APP_DEV_SERVER: JSON.stringify(require('../envConfig').devServer)
    })
  ]
};

module.exports = config;
