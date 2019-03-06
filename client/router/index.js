import {BrowserRouter, Route, Switch, withRouter}  from 'react-router-dom';
import React from 'react';
import routers from './pages';
const router = ({ssrData, ssrPath}) => {
    //把ssr数据注入到所有页面中，第一个路由的页面接收到以后，其他页面需要废弃使用当前数据，并且调用getInitialProps方法初始化
    routers.forEach((item)=>{
        let _ssrData = null;
        //如果当前路由注册并且首次渲染的路径匹配，给组件注入ssrData(这段代码只会在首次加载，路由注册时才执行)
        if(ssrPath == item.path){
            _ssrData = ssrData;
        }
        item.render = ()=>{
            item.component = withRouter(item.component);//注入路由信息
            return <item.component ssrData={_ssrData}/>
        }
    })
    return (
        <BrowserRouter>
            <Switch>
                {routers.map((route, i) => (
                    <Route key={i} exact={route.exact} path={route.path} render={route.render}/>
                ))}
            </Switch>
        </BrowserRouter>
    )
}

export default router;