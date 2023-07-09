#!/bin/sh
set -e

if [ -n "$CI" ]; then
    pip3 install --user boto3
fi
./ci/deploy.py ./dist/ beta.bios-pw.org
