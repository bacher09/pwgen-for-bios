#!/bin/sh
cat ./coverage/lcov.info | $(npm bin)/coveralls || true
