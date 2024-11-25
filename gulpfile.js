"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass")(require("sass"));
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var uglify = require("gulp-uglify");

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({errLogToConsole: true, includePaths: require("node-normalize-scss").includePaths}))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    //.pipe(csso())
    //.pipe(rename("style.min.css"))
    //.pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
});

gulp.task("vendorCss", function () {
  return gulp.src("source/vendor_css/*.css")
    .pipe(gulp.dest("build/css"));
});

gulp.task("js", function() {
  return gulp.src("source/js/*.js")
    //.pipe(uglify())
    //.pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/img/**/*.{svg,png,jpg,webp}", gulp.series("html", "refresh"));
  gulp.watch("source/js/script.js", gulp.series("js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  //gulp.watch("source/ajax/*.html", gulp.series("ajax", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("images", function() {
  return gulp.src("source/img/*.{png,jpg,svg}", {encoding: false})
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("ajax", function () {
  return gulp.src("source/ajax/*.html")
      .pipe(posthtml([
        include()
      ]))
      .pipe(gulp.dest("build/ajax"));
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2,eot,svg,otf,ttf}",
    "source/img/*.webp",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series(
	"clean",
	"copy",
	"css",
	"vendorCss",
	"js",
	"images",
	"html",
//	"ajax",
));

gulp.task("start", gulp.series("build", "server"));
