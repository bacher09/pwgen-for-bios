const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const jasmine = require("gulp-jasmine");
const sourcemaps = require('gulp-sourcemaps');
const istanbul = require("gulp-istanbul");
const remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
const tsProject = ts.createProject("tsconfig.json");
const del = require('del');

gulp.task("coverage-build", function() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(sourcemaps.write('.', {includeContent: false}))
        .pipe(gulp.dest("coverage-dist"));
});

gulp.task("pre-coverage", ["coverage-build"], function() {
    return gulp.src(["coverage-dist/**/*.js"])
            .pipe(istanbul())
            .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['coverage-build', 'pre-coverage'], function() {
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

gulp.task('lint', function() {
    return tsProject.src()
        .pipe(tslint({"formatter": "verbose"}))
        .pipe(tslint.report());
});

gulp.task('test-build', function() {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest("test-dist"));
});

gulp.task('test', ['test-build'], function() {
    return gulp.src("test-dist/**/*.spec.js")
        .pipe(jasmine());
});

gulp.task('clean', function(cb) {
    del(['dist', 'test-dist', 'coverage-dist', 'coverage']).then(paths => cb());
});

gulp.task('default', ['test', 'lint', 'coverage'])
