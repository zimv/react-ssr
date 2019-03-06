//采用rem布局，但是因为后端首次渲染无法知道客户端屏幕宽度，因此计算屏幕宽度的代码，
//需要后端返回，并且需要在header中载入，这样首次dom渲染出来的时候，布局就是正确的。
const rem = `
    //html:20px: 16rem 320px
    let base = 16;//rem

    let wid =  window.innerWidth || document.body.clientWidth;
    let size = 20;
    if(wid > 750) wid = 750;
    if(wid > 320){
        size = wid/base;
    }
    document.querySelector('html').style = 'font-size:' + size+'px';
`;
export default rem;