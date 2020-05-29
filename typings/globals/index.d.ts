declare const GOOGLE_ANALYTICS_TAG: string | undefined;

interface Window {
    dataLayer: any[];
}

interface Performance {
    webkitNow(): number;
    mozNow(): number;
    oNow(): number;
    msNow(): number;
}
