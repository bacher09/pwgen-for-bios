const path = require("path");

module.exports = function(config) {

    var customLaunchers = {
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
            './ci/spec-bundle.js': ['webpack'],
        },
        webpackMiddleware: {
            scripts: 'errors-only'
        },
        webpack: {
            devtool: "inline-source-map",
            mode: "development",
            resolve: {
                extensions: ['.ts', '.js', '.mjs'],
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        exclude: /node_modules/,
                        use: [
                            "@jsdevtools/coverage-istanbul-loader",
                            {loader: 'ts-loader', options: {transpileOnly: true}}
                        ]
                    },
                    {
                        test: /\.m?js$/,
                        exclude: /node_modules/,
                        use: [{loader: 'babel-loader', options: {presets: ['@babel/preset-env']}}]
                    }
                ]
            },
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        reporters: ["progress", "coverage-istanbul"],
        coverageIstanbulReporter: {
            reports: ['text', 'text-summary', "lcovonly"],
            dir: path.join(__dirname, "coverage"),
            combineBrowserReports: true,
            fixWebpackSourcePaths: true,
        },
        browsers: ["ChromeHeadless", "FirefoxHeadless"],
        customLaunchers: customLaunchers,
        singleRun: true,
        concurrency: 2,
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-webpack',
            'karma-coverage-istanbul-reporter'
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
