module.exports = function(config) {
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
        reporters: ["progress"],
        browsers: ["ChromeHeadless", "FirefoxHeadless"],
        customLaunchers: {
            ChromeHeadlessTravis: {
                base: "ChromeHeadless",
                flags: ['--no-sandbox']
            }
        },
        concurrency: 8,
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-webpack',
            'karma-sourcemap-loader'
        ]
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['ChromeHeadlessTravis', 'FirefoxHeadless'];
    }

    config.set(configuration);
}
