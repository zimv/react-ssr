
import fs from 'fs';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {clientPages} from './../../client/router/pages';

import rem from './../../client/assets/js/rem';

let bundles = {
    app: '/js/app.js',
    vendor: '/js/vendor.js'
}

const routerRegister = (router, env) => {
    //dev需要热重载,
    if(env == 'dev'){
        const hostname = APP_DEV_SERVER;
        bundles.app = hostname + bundles.app;
        bundles.vendor = hostname + bundles.vendor;
    }

    router.get('*', (ctx, next)=>{
        console.log('get: ',ctx.path);
        /***** ajax *******/
        if(ctx.path == '/api/getData'){
            ctx.response.type = 'json';
            ctx.response.body = {errCode:0, msg:'', data: 'ajax response data'};
            next();
            return;
        }
        if(ctx.path == '/api/getList'){
            ctx.response.type = 'json';
            ctx.response.body = {errCode:0, msg:'', data: ['卫架构','小撸','大湿人','飞j2狐']};
            next();
            return;
        }
        if(/^\/js/.test(ctx.path)) return ()=>{next()};

        let component;
        if(env == 'dev'){
            //每次访问清除缓存，这样就能拿到最新的模块,拿到的仅仅是当前模块，通过当前模块引入的子组件缓存并没有被清掉
            //这个问题就麻烦了，因为子组件还会有子组件，我们必须要删除这个下面所有的缓存才行
            //然而原因是我们在server打包的时候，pages的包和依赖全部已经打包到sever，bundle里去了，清除缓存的时候仅仅是清除了根模块，子模块所定义的模块仍然在缓存里
            //webpack的所有模块引用都会一个个在需要的时候载入__webpack_require__，并存到缓存
            //resolve alias应用别名以后，因为我们也需要对这个pages文件作为外部扩展不bundle到server模块，所以要把这个别名加到externals规则里，但又会导致bundle的require别名
            //没有被解析，所以这里直接写运行时的cwd对应pages路径，然后在externals里排除
            //__non_webpack_require__这个方法可以跳过webpack打包，最终转化为bundle中，require
            const path = require('path');
            const cwd = process.cwd();
            delete __non_webpack_require__.cache[__non_webpack_require__.resolve(path.resolve(cwd,'dist/pages/pages.js'))];
            component = __non_webpack_require__(path.resolve(cwd,'dist/pages/pages.js')).clientPages[ctx.path];
        }else{
            component = clientPages[ctx.path];
        }

        if(component){
            return (async () => {
                ctx.response.type = 'html';
                let indexHtml = fs.readFileSync(process.cwd()+'/server/view/index.html', 'utf-8');
                const data = await component.getInitialProps();
                //因为component是变量，所以需要create
                indexHtml = indexHtml.replace('$$$$', renderToString(
                    React.createElement(component, {
                        ssrData: data
                    })
                ));
                indexHtml = indexHtml.replace('/*rem*/', rem);
                indexHtml = indexHtml.replace('/*title*/', component.title);
                indexHtml = indexHtml.replace('/*ssrInitData*/', `window.ssrData=${JSON.stringify(data)};window.ssrPath='${ctx.path}'`);
                indexHtml = indexHtml.replace('/*app*/', bundles.app);
                indexHtml = indexHtml.replace('/*vendor*/', bundles.vendor);
                
                ctx.response.body = indexHtml;
                next();
            })()
        }
        ctx.response.body = '404';
    })
}


export default routerRegister;