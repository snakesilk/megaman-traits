#! /usr/bin/env bash
set -e

DIST="./package"

if [ -d "$DIST" ]; then
    rm -r $DIST
fi

babel ./src --out-dir $DIST/lib

cp package.json $DIST
