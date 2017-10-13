var app_path='app/',
    asset_path=app_path+'public/asset/',
    dist_path=app_path+'public/dist/',
    view_path=app_path+'view/';
var paths={
    entrySass:asset_path+'sass/*.scss',
    disCss:asset_path+'css/',
    disJs:dist_path+'js/',
    watch: {
        sass: [asset_path+'**/*.scss'],
    },
};

// 引入 gulp
var gulp = require('gulp');
// 引入组件
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps'),
    clean=require('gulp-clean');
var autoprefix=require('gulp-autoprefixer'),
    runSequence=require('run-sequence');

// 编译Sass
gulp.task('sass', function (done) {
    gulp.src(paths.entrySass)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefix({browsers: ['last 8 version']}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.disCss))
        .on('end', done);
});
gulp.task('cleanCss', function () {
    console.log("——————————————开始清空 assets/dist_css 下的css文件");
    return gulp.src(paths.disCss+'*.css', {read: false})
        .pipe(clean());
});
gulp.task('cleanJs', function () {
    console.log("——————————————开始清空 assets/dist_js 下的js文件");
    return gulp.src(paths.disJs+'*.js', {read: false})
        .pipe(clean());
});
gulp.task('build', function(callback) {
    runSequence(['sass'],'min', function () {
        console.log("——————————————项目构建完成");
    });
});
gulp.task('min',function(){
    gulp.src(asset_path+'js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(paths.disJs));
});
gulp.task('watch', function () {
    gulp.watch(paths.watch.sass, ['sass']);
});
gulp.task('default', [ 'sass', 'watch']);


