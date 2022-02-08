const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { exec } = require('child_process');
const Terser = require('terser-webpack-plugin');
const fs = require('fs');


class VersionInfoPlugin {
    constructor(options = {}) {
        if (options.filename == void 0) {
            throw new Error('[VersionInfoPlugin] filename should be set');
        }
        this.options = options;
    }

    apply(compiler) {
        const plugin = { name: 'VersionInfoPlugin' }
        compiler.hooks.afterEmit.tapAsync(plugin, (compilation, callback) => {
            exec('git describe --tags --always', (error, stdout, stderr) => {
                if (error) {
                    compilation.errors.push(error);
                    callback();
                    return;
                }

                var version_info = `version: ${stdout.trim()}\ntime: ${new Date().toISOString()}\n`;
                if (process.env.TRAVIS) {
                    version_info += `build id: TRAVIS ${process.env.TRAVIS_JOB_NUMBER} (${process.env.TRAVIS_BUILD_ID})\n`;
                }

                const filename = path.join(compiler.options.output.path, this.options.filename);

                fs.writeFile(filename, version_info, (err) => {
                    if (err) {
                        compilation.errors.push(err);
                    }
                    callback();
                })
            });
        });
    }
}

function getWebpackConfig(production, gtag) {
    var webpackMode;

    production = (typeof(production) === 'undefined') ? false : production;
    gtag = (typeof(gtag) === 'undefined') ? "" : gtag;

    var plugins = [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'assets/bootstrap.min.css', to: 'assets/'},
                {from: 'assets/images/favicon.ico', to: 'favicon.ico'},
                {from: 'assets/images/', to: 'assets/images/'},
            ]
        }),
        new DefinePlugin({
            GOOGLE_ANALYTICS_TAG: JSON.stringify(gtag)
        }),
        new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
            },
            template: 'html/index.html',
        }),
        new VersionInfoPlugin({filename: 'version-info.txt'})
    ];

    if (production) {
        webpackMode = "production";
    } else {
        webpackMode = "development";
    }

    return {
        entry: "./src/ui.ts",
        output: {
            filename: "assets/bundle.[hash].js",
            path: path.join(__dirname, "dist")
        },
        plugins: plugins,
        optimization: {
            concatenateModules: false,
            minimizer: [
                new Terser({})
            ]
        },
        devtool: "source-map",
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            port: 9000
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        mode: webpackMode,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [{loader: 'ts-loader', options: {transpileOnly: false}}]
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: [{loader: 'babel-loader', options: {presets: ['@babel/preset-env']}}]
                }
            ]
        }
    }
}

exports.getWebpackConfig = getWebpackConfig
