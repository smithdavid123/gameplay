// 判断元素类型
export function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

// 数组过滤
export function filterArray(arr) {
    arr.filter(item => {
        return item !== '' && item !== 'undefined' && item !== null;
    });
    return arr;
}

// 参数过滤函数
export function filterNull(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            ((key !== 'value' && obj[key] === '') || obj[key] === 'undefined' || obj[key] === null) && delete obj[key];
            toType(obj[key]) === 'string' ? obj[key] = obj[key].trim() : toType(obj[key]) === 'object' ? obj[key] = filterNull(obj[key]) : (toType(obj[key]) === 'array') && (obj[key] = filterArray(obj[key]));
        }
    }
    return obj;
}

// 获取指定日期的前几天或后几天
// date 代表指定的日期，格式：2022-09-27
// day 传-1表始前一天，传1表始后一天
export function getNextDate(date, day) {
    let dd = new Date(date);
    dd.setDate(dd.getDate() + day);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
    return y + '-' + m + '-' + d;
}

// 去掉前后空格
export function trimSpace(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

// 把一个或多个空格替换成一个空格
export function singleSpace(str) {
    return str.replace(/\s+/g, ' ');
}

// 去掉左右空格
export function noSpace(str) {
    return str.replace(/\s+/g, '');
}