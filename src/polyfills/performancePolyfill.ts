/* eslint-disable @typescript-eslint/unbound-method */

function makeMonotonicTime(): () => number {
    if (typeof performance !== "undefined" && performance) {
        let nowFun = performance.now  ||
            performance.webkitNow     ||
            performance.mozNow        ||
            performance.oNow          ||
            performance.msNow;

        if (nowFun) {
            return nowFun.bind(performance);
        } else {
            return Date.now;
        }
    } else {
        return Date.now;
    }
}

export const monotonicTime = makeMonotonicTime();
