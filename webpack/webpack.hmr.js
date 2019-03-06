const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const port = require('../config').devServerPort;

const Hmr = () => {
  const config = require('./webpack.client-dev.js');
  const options = {
    stats: 'errors-only',//只输出错误日志
    logLevel: 'warn',//不想看到那个complied successfully
    hot: true,
    host: 'localhost',
    //cors
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": 'X-Requested-With,ownerId,Content-Type',
      "Access-Control-Allow-Methods": 'GET,POST,OPTIONS,DELETE,PUT',
      "Access-Control-Allow-Origin": '*'
    },
    port: port, //客户端去请求的端口，如果不设置，默认是当前页面的端口
    watchOptions: {
      ignored: ['node_modules'],
      aggregateTimeout: 1000 //优化，尽量保证后端重新打包先执行完
    },
  };

  webpackDevServer.addDevServerEntrypoints(config, options);
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, options);

  server.listen(port, 'localhost', () => {
    console.log(`dev server HMR listening on port ${port}`);
  });

  const config2 = require('./webpack.server-dev.js');
  const compiler2 = webpack(config2);
  compiler2.watch(config2.watchOptions,(err)=>{
    if(err) console.log(err)
  });
}
module.exports = Hmr;
