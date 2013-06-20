#!/bin/bash

OUTPUTDIR="OPrime-Android/assets/"

cd $OUTPUTDIR
#git checkout release

echo "Copying index.html and putting it into the $OUTPUTDIR"
cp ../../OPrime-HTML5/samples/index.html index.html
cp ../../OPrime-HTML5/samples/oprime.css oprime.css

#git checkout master


