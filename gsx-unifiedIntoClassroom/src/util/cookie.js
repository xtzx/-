/**
 * @file Cookie 解释
 * @author dafo<huanghoujin@baijiahulian.com>
 */

const HOUR_TIME = 60 * 60 * 1000;

/**
 * 解释 cookie
 *
 * @param {string=} [cookie=document.cookie]
 * @return {Object} 解释后的 Cookie Map
 */
// eslint-disable-next-line import/prefer-default-export
export const parseCookie = (cookie = document.cookie) =>
    cookie.split(';').reduce((result, item) => {
        const [key, value] = item.split('=');
        result[key.trim()] = value;

        return result;
    }, {});

// 设置 cookie
// @inner
// @param {string} name
// @param {string} value
// @param {Object=} options
export function setCookie(name, value, options = {}) {
    let expires = options.expires;

    if (!isNaN(expires)) {
        const hours = expires;
        expires = new Date();
        expires.setTime(expires.getTime() + hours * HOUR_TIME);
    }

    let path = options.path;
    if (path == null) {
        // 保证网站全局可用
        path = '/';
    }

    const domain = options.domain;
    document.cookie = [
        encodeURIComponent(name),
        '=',
        encodeURIComponent(value),
        expires ? `;expires=${expires.toUTCString()}` : '',
        `;path=${path}`,
        domain ? `;domain=${domain}` : '',
        options.secure ? ';secure' : '',
    ].join('');
}

// 获取cookie
export function getCookie(name) {
    const regex = new RegExp(name + '=([^;]+)(?:;|$)');
    const match = document.cookie.match(regex);
    return match ? decodeURIComponent(match[1]) : '';
}
