import Cookies from 'js-cookie';

export function getCookie(name) {
    return Cookies.get(name);
}

export function setCookie(name, value, expires) {
    return Cookies.set(name, value, { expires, path: '/' });
}

export function removeCookie(name) {
    return Cookies.remove(name);
}