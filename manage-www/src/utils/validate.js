export function validEmail (rule, value, callback) {
    if (!isvalidEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'));
    } else {
        callback();
    }
}

export function validPhone (rule, value, callback) {
    if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
    } else {
        callback();
    }
}

export function validName (rule, value, callback) {
    if (!isvalidName(value)) {
        callback(new Error('请输入不小于6位,英文,数字,英文字符'));
    } else {
        callback();
    }
}

/* 电话格式 */
export function isvalidPhone (str) {
    const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
    return reg.test(str);
}

/* 用户名 */
export function isvalidName (str) {
    const reg = /^[a-zA-Z0-9_-]{6,}$/;
    return reg.test(str);
}

/* 邮箱格式 */
export function isvalidEmail (email) {
    const reg = /(^([a-zA-Z0-9_-]){4,18})+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(email);
}
