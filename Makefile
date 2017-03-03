CD=$(shell pwd)
WEBPACK=$(CD)/node_modules/.bin/webpack
GULP=$(CD)/node_modules/.bin/gulp

all: build

build: gulp-build bundle

watch:
	$(MAKE) -j webpack-watch gulp-watch


gulp-build:
	$(GULP)

gulp-watch:
	$(GULP) watch


bundle:
	$(WEBPACK)

webpack-watch:
	$(WEBPACK) --watch


.PHONY: all \
    build watch \
    gulp-build gulp-watch \
    bundle webpack-watch
