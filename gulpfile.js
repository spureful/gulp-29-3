const gulp = require('gulp');
const sass = require('gulp-sass');

const del = require("del");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

const imagemin = require('gulp-imagemin');
 const svgSprite = require('gulp-svg-sprite');


sass.compiler = require('node-sass');

 config = {

    mode: {
     symbol: true // Activate the «symbol» mode
    }
  };

//компилировать scss
gulp.task('sass', function () {
  return gulp.src('./src/scss/main.scss')  	 	
    .pipe(sass().on('error', sass.logError))
   	.pipe(gulp.dest('./build/css'))
    .pipe(reload({
            stream: true
        }));

});



gulp.task('scripts', function () {
  return gulp.src('./src/js/*.js')
       .pipe(gulp.dest('./build/js'))
       .pipe(reload({
            stream: true
        }));
});
 

 gulp.task('clean', function () {
    return del(`./build/`);
  });
//переносить шрифты

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/**')
       .pipe(gulp.dest('./build/fonts'));
});
//переносить индекс реьд

gulp.task('html', function () {
  return gulp.src('./src/*.html')
       .pipe(gulp.dest('./build/'))
       .pipe(reload({
            stream: true
        }));
});
//переносить и минифицировать картинки

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
});

//создать свг-спрайт
gulp.task('sprite', function () {
return gulp.src('./src/img/icons/*.svg')
  .pipe(svgSprite(config))
  .pipe(gulp.dest('./build/img/sprite'));
  });

//запустить девсервер
gulp.task("server", () => {
    browserSync.init({
        server: {
           baseDir: `build`
         },
         open: true
        });
    });
//сделать вотчер
gulp.task('watch', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.series("sass"));
  gulp.watch(`src/js/*.js`, gulp.series("scripts"));
  gulp.watch(`src/*.html`, gulp.series("html"));
  gulp.watch(`src/img/**`, gulp.series("img"));

});

   gulp.task('default', 
   	gulp.series(
        'clean',
        'sprite',
        gulp.parallel(
        'img',
         'fonts',
        'sass',
        'scripts',
        'html'
        ),    
        
   		 gulp.parallel(
        'watch', 'server'
        )
 
  
    	))


