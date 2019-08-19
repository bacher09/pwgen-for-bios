module.exports = function(config) {

    var customLaunchers = {
        sl_ie_10: {
            base: "SauceLabs",
            browserName: "internet explorer",
            platform: "Windows 7",
            version: "10"
        },
        sl_safari_7: {
            base: "SauceLabs",
            browserName: "safari",
            platform: "OS X 10.10",
            version: "8.0"
        },
        sl_ios_safari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'iOS',
            deviceName: 'iPhone 6 Simulator',
            version: '10.3',
            deviceOrientation: 'portrait'
        },
        sl_android: {
            base: "SauceLabs",
            browserName: 'Browser',
            patform: 'Android',
            version: '5.1',
            deviceName: 'Android Emulator',
            deviceOrientation: 'portrait'
        },
        sl_chrome_41: {
            base: "SauceLabs",
            browserName: 'chrome',
            platform: 'Linux',
            version: '41'
        },
        sl_firefox_8: {
            base: "SauceLabs",
            browserName: 'firefox',
            platform: 'Linux',
            version: '8.0'
        },
        sl_edge_13: {
            base: "SauceLabs",
            browserName: 'MicrosoftEdge',
            platform: 'Windows 10',
            version: '13.10586'
        },
        ChromeHeadlessTravis: {
            base: "ChromeHeadless",
            flags: ['--no-sandbox']
        }
    };

    var configuration = {
        frameworks: ["jasmine"],
        files: [
            {pattern: './ci/spec-bundle.js', watched: false}
        ],
        preprocessors: {
            './ci/spec-bundle.js': ['webpack', 'sourcemap'],
        },
        webpackMiddleware: {
            scripts: 'errors-only'
        },
        webpack: {
            devtool: "inline-source-map",
            mode: "development",
            resolve: {
                extensions: ['.ts', '.js'],
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        exclude: /node_modules/,
                        use: [{loader: 'ts-loader', options: {transpileOnly: true}}]
                    }
                ]
            },
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        sauceLabs: {
            testName: "Bios-pw Unit tests",
            retryLimit: 2,
            recordVideo: false,
            recordScreenshots: false
        },
        reporters: ["progress", "saucelabs"],
        browsers: ["ChromeHeadless", "FirefoxHeadless"],
        customLaunchers: customLaunchers,
        singleRun: true,
        concurrency: 2,
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-sauce-launcher',
            'karma-webpack',
            'karma-sourcemap-loader'
        ]
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['ChromeHeadlessTravis', 'FirefoxHeadless'];
    }

    if (process.env.SAUCE && process.env.SAUCE_USERNAME) {
        var currentBrowsers = configuration.browsers;
        var sauceBrowsers = Object.keys(customLaunchers).filter((s) => s.startsWith('sl_'));
        configuration.browsers = currentBrowsers.concat(sauceBrowsers);

        if (process.env.TRAVIS) {
            var buildNumber = process.env.TRAVIS_BUILD_NUMBER;
            var travisBuildId = process.env.TRAVIS_BUILD_ID;
            var buildId = `TRAVIS ${buildNumber} (${travisBuildId})`;
            configuration.sauceLabs.build = buildId;
            configuration.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
        }
    }

    config.set(configuration);
}
