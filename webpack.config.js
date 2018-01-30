const path = require('path');
const os = require('os');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function makeClosureCompiler() {
    var pluginOptions = {
        compiler: {
            compilation_level: "ADVANCED",
            create_source_map: true
        },
        concurrency: os.cpus().length
    };

    if (process.env.CLOSURE_PATH) {
        pluginOptions.compiler.jar = process.env.CLOSURE_PATH;
    }

    return new ClosureCompilerPlugin(pluginOptions);
}

var plugins = [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
        { from: 'assets/bootstrap.min.css'}
    ]),
    new HtmlWebpackPlugin({
        minify: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true
        },
        inject: true,
        template: 'html/index.html'
    })
];

if (process.env.PRODUCTION) {
    plugins.push(makeClosureCompiler());
}


module.exports = {
    entry: "./src/ui.ts",
    output: {
        filename: "bundle.[hash].js",
        path: path.join(__dirname, "dist")
    },
    plugins: plugins,
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 9000
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{loader: 'ts-loader', options: {transpileOnly: true}}]
            }
        ]
    }
}
