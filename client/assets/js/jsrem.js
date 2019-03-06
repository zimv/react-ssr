const base = 20;
const jsrem = (val)=>{
    return val/20 + 'rem';
}
const designWidth = 320;
export default {parse: jsrem, width:designWidth};