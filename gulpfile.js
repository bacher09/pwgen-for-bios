var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var jasmine = require("gulp-jasmine");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('test', ['build'], function() {
    return gulp.src("dist/*.spec.js").pipe(jasmine());
});

gulp.task('lint', function() {
    return tsProject.src()
        .pipe(tslint({"formatter": "verbose"}))
        .pipe(tslint.report());
});

gulp.task('default', ['build', 'test', 'lint'])
