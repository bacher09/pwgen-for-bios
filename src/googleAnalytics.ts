/* tslint:disable:no-empty */
/* tslint:disable:only-arrow-functions */
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
