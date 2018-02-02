#!/bin/sh
set -e
CLOSURE_COMPILER_URL="https://dl.google.com/closure-compiler/compiler-latest.zip"

install_closure() {
    wget $CLOSURE_COMPILER_URL -O /tmp/closure.zip
    mkdir /tmp/closure/
    unzip /tmp/closure.zip -d /tmp/closure/
    CLOSURE_JAR=$(ls /tmp/closure/closure-compiler-*.jar)
    export CLOSURE_PATH=$CLOSURE_JAR
}

build_package() {
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
