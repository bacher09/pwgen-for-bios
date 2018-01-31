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


install_closure
build_package

ls dist/
