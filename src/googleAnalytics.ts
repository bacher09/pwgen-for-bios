/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prefer-rest-params */
/** @type {function(...*):void} */
export let gtag: (...args: any[]) => void = () => {};

if (GOOGLE_ANALYTICS_TAG) {
    let gaElem = document.createElement("script");
    gaElem.async = true;
    let tag = GOOGLE_ANALYTICS_TAG;
    gaElem.src = `https://www.googletagmanager.com/gtag/js?id=${tag}`;
    let firstScript = document.getElementsByTagName("script")[0] as HTMLScriptElement;
    (firstScript.parentNode as HTMLElement).insertBefore(gaElem, firstScript);

    window.dataLayer = window.dataLayer || [];
    gtag = function() { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GOOGLE_ANALYTICS_TAG, {
        "custom_map": {"dimension1": "siteVersion"},
        "transport_type": "beacon"
    });
}
