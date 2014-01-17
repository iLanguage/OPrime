#!/bin/bash

for f in *.png; do convert $f -filter lanczos2 -resize 600x -extent 600x200 -quality 75 ${f%png}jpg; done
