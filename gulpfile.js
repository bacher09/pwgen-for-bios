var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var jasmine = require("gulp-jasmine");
var sourcemaps = require('gulp-sourcemaps');
var istanbul = require("gulp-istanbul");
var remapIstanbul = require("remap-istanbul/lib/gulpRemapIstanbul");
var tsProject = ts.createProject("tsconfig.json");

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
    return gulp.src("coverage-dist/*.spec.js")
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
    return gulp.src("test-dist/*.spec.js")
        .pipe(jasmine());
});

gulp.task('default', ['test', 'lint', 'coverage'])
