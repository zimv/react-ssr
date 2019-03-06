const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const staticCache = require('koa-static-cache');
const appPort = require('../config').appPort;
let env = 'production';
if(process.argv[2] == 'dev') env = 'dev';

const app = new Koa();

//使用router
const router = new Router();
app.use(bodyParser());
//注册静态资源,需要注册在路由之前
//开发环境，由于在server中运行dev-server执行webpack,会把图片输出到server/assets中，而js路径指向dev-server地址，因此这里的静态资源仅仅是访问图片
if(env == 'dev'){
  app.use(staticCache('dist/pages'));
}else{
  app.use(staticCache('dist/client', {
    cacheControl: 'no-cache,public',
    gzip: true
  }));
}

//注册路由
app.use(router.routes());
app.use(router.allowedMethods());
import routerRegister from './router/index';
routerRegister(router, env);

app.listen(appPort);
console.log(`app start, port ${appPort}`);

app.on('error', function (err, ctx) {
  console.log(err)
})