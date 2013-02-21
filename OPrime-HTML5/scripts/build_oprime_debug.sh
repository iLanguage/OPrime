#!/bin/bash

echo "Cleaning up from previous builds"
rm -rf build
mkdir build
mkdir build/js

echo "Copying over the assets to the build"
cp -r client/css build/
cp -r client/images build/

echo "Building OPrime"
node_modules/requirejs/bin/r.js -o client/js/oprime_build_config.js
cp client/release/oprime.js build/js/oprime.js

echo "Cleaning up temp release folder"
rm -rf client/release

date;