
import axios from 'axios';
let baseURL = APP_BASE_URL;//webpack defined var
if(typeof window != 'undefined'){//客户端以当前域名为请求域
  baseURL = window.location.origin;
}
//避免服务端注册多个同一拦截器，因为服务端路由会多次require pages.js
//修改了拦截器需要手动重启，因为修改后不会被push进去，也不会替换
if(axios.interceptors.response.handlers.length==0){
  // 响应拦截器即异常处理
  axios.interceptors.response.use(
    response => {
      let data = response.data;
      if (data.errCode == 0) {
        return data;
      } else {
        return data;
      }
    },
    err => {
      if (err) {
          console.log(err);
      }
      return Promise.resolve(err);
    }
  );
}
  export default {
    // get请求
    get(url, param) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          baseURL: baseURL,
          url,
          params: param,
          withCredentials: true// 允许携带cookie
        }).then(res => {
          resolve(res);
        }).catch(err=>{
          console.log(err)
        });
      });
    },
    // post请求
    post(url, param) {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          baseURL: baseURL,
          url,
          data: param,
          withCredentials: true// 允许携带cookie
        }).then(res => {
          resolve(res);
        }).catch(err=>{
          console.log(err)
        });
      });
    }
  };
  