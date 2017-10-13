var project_path='html/',//自定义编译完成后的项目文件夹
    js_file1_name='',//自定义最后编译完成后生成的js文件名
    js_file2_name='',
    css_file_name='',//自定义最后编译完成后生成的css文件名
    html_path='origin/';//自定义需要编译的html文件路径，默认会把该路径下的所有html进行编译

// 引入 gulp
var gulp = require('gulp');

// 引入组件
var autoprefix=require('gulp-autoprefixer');

gulp.task('autoprefixerCss', function (done) {
  console.log("——————————————gulp 自动补全");
  gulp.src('./dist/css/*.css')
    .pipe(autoprefix({browsers: ['last 6 version']}))
    .pipe(gulp.dest('./dist/css/'));
});


gulp.task('default', [ 'autoprefixerCss'],function () {
  console.log("——————————————究级核弹启动!!!倒计时 3");

});



