CD=$(shell pwd)
BROWSERIFY=$(CD)/node_modules/.bin/browserify
WATCHIFY=$(CD)/node_modules/.bin/watchify
GULP=$(CD)/node_modules/.bin/gulp

all: build

build: gulp-build bundle

watch:
	$(MAKE) -j watchify gulp-watch


gulp-build:
	$(GULP)

gulp-watch:
	$(GULP) watch


bundle:
	browserify src/main.js --outfile dist/bundle.js --debug

watchify:
	watchify src/main.js --outfile dist/bundle.js --debug


.PHONY: all \
    build watch \
    gulp-build gulp-watch \
    bundle watchify
