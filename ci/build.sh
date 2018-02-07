#!/bin/sh
set -e
CLOSURE_COMPILER_URL="https://dl.google.com/closure-compiler/compiler-latest.zip"
PROD_GOOGLE_ANALYTICS="UA-112154345-1"
STAGE_GOOGLE_ANALYTCIS="UA-112154345-2"

install_closure() {
    wget $CLOSURE_COMPILER_URL -O /tmp/closure.zip
    mkdir /tmp/closure/
    unzip /tmp/closure.zip -d /tmp/closure/
    CLOSURE_JAR=$(ls /tmp/closure/closure-compiler-*.jar)
    export CLOSURE_PATH=$CLOSURE_JAR
}

build_package() {
    if [ -n "$TRAVIS_TAG" ]; then
        export GOOGLE_ANALYTICS_TAG="$PROD_GOOGLE_ANALYTICS"
        echo "Using prod google analytics tag"
    else
        export GOOGLE_ANALYTICS_TAG="$STAGE_GOOGLE_ANALYTCIS"
        echo "Using stage google analytics tag"
    fi
    PRODUCTION=1 npm run webpack
}

build_info() {
    VERSION=$(git describe --tags --always)
    echo "version: ${VERSION}" >> dist/version-info.txt
    echo "time: $(TZ=UTC date +'%Y-%m-%d %H:%M')" >> dist/version-info.txt
    if [ -n "$TRAVIS" ]; then
        echo "build id: TRAVIS ${TRAVIS_JOB_NUMBER} (${TRAVIS_BUILD_ID})" >> dist/version-info.txt
    fi
}


install_closure
build_package
build_info
