import Index from "../pages/index";
import List from "../pages/list";
const routers = [
  {
    exact: true,
    path: "/",
    component: Index
  },
  {
    exact: true,
    path: "/list",
    component: List
  }
];
//注册页面和引入组件，存在对象中，server路由匹配后渲染
export const clientPages = (() => {
  const pages = {};
  routers.forEach(route => {
    pages[route.path] = route.component;
  });
  return pages;
})();
export default routers;
