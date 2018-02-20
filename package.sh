#!/usr/bin/env bash

NAME=$1

echo $NAME

# remove .DS_Store files
find . -type f -name './src/*.DS_Store' -ls -delete

if [ -f ./$NAME.crx ]; then
  rm ./$NAME.crx
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src --pack-extension-key=./$NAME.pem
  mv ./src.crx ./$NAME.crx
else
  echo "$NAME doesn't exist, no stress packing it up now"
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src
  mv ./src.crx ./$NAME.crx
  mv ./src.pem ./$NAME.pem
fi

rm ./$NAME.zip

# Zip up everything in side of ./src except ./src/css, ./src/js, and ./src/sass
zip -r -X $NAME.zip ./src -x \*/css\* \*/js\* \*/sass\*

echo "$NAME Package complete!"
