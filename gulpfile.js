const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const jasmine = require("gulp-jasmine");
const sourcemaps = require('gulp-sourcemaps');
const istanbul = require("gulp-istanbul");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
const tsProject = ts.createProject("tsconfig.json");
const del = require('del');
const { getWebpackConfig } = require('./webpack.base');
const webpack = require('webpack');

function coverage_build() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.', {includeContent: false}))
        .pipe(gulp.dest("coverage-dist"));
};

const pre_coverage = gulp.series(coverage_build, function() {
    return gulp.src(["coverage-dist/**/*.js"])
            .pipe(istanbul())
            .pipe(istanbul.hookRequire());
});

const coverage = gulp.series(coverage_build, pre_coverage, function() {
    return gulp.src("coverage-dist/**/*.spec.js")
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: ['json'],
            reportOpts: {
                json: {dir: './coverage', file: 'coverage-js.json'}
            }
        })).on("end", function () {
            return gulp.src('coverage/coverage-js.json')
                    .pipe(remapIstanbul({
                        basePath: 'src/',
                        reports: {
                            'json': './coverage/coverage.json',
                            'html': './coverage/html-report',
                            'lcovonly': './coverage/lcov.info',
                            'text': null
                        }
                    }));
        });
});

function lint() {
    return tsProject.src()
        .pipe(tslint({"formatter": "verbose"}))
        .pipe(tslint.report());
}

function clean(cb) {
    del(['dist', 'test-dist', 'coverage-dist', 'coverage']).then(paths => cb());
}

function test_build() {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest("test-dist"));
}

const test = gulp.series(test_build, function() {
    return gulp.src("test-dist/**/*.spec.js").pipe(jasmine());
});

function build_webpack(gtag, cb) {
    webpack(getWebpackConfig(true, gtag), (err, stats) => {
        cb();
    });
}

function clean_dist(cb) {
    del(['dist']).then(paths => cb());
}

function build_prod(cb) {
    build_webpack("UA-112154345-1", cb);
}

function build_stage(cb) {
    build_webpack("UA-112154345-2", cb);
}

exports.lint = lint;
exports.clean = clean;
exports.test = test;
exports.coverage = coverage;
exports.build_prod = gulp.series(clean_dist, build_prod);
exports.build_stage = gulp.series(clean_dist, build_stage);
exports.default = gulp.parallel(lint, gulp.series(test, coverage));
