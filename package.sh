#!/usr/bin/env bash

NAME=$1
PLATFORM=${2:-'all'}

echo $NAME

# Zip up everything in side of ./src except ./src/css, ./src/js, and ./src/sass
create_zip() {
  cd src
  zip -r -X ../$1.zip * -x css\* js\* sass\*
  echo "📦  $1.zip zipped"
}



# clean-up .DS_Store
find . -type f -name './src/*.DS_Store' -ls -delete



# package for Firefox
# $ ./package.sh foo
# $ ./package.sh foo all
# $ ./package.sh foo firefox
if [ $PLATFORM = 'firefox' ] || [ $PLATFORM = 'all' ]; then
  # rm ./$NAME.xpi
  # 7z a -t7z $NAME.xpi ./src/*
  rm ./$NAME-firefox.xpi
  create_zip $NAME-firefox
fi

# package for Chrome
# $ ./package.sh foo
# $ ./package.sh foo all
# $ ./package.sh foo chrome
if [ $PLATFORM = 'chrome' ] || [ $PLATFORM = 'all' ]; then
  if [ -f ./$NAME.crx ]; then
    rm ./$NAME.crx
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src --pack-extension-key=./$NAME.pem
    mv ./src.crx ./$NAME.crx
  else
    echo "😳 $NAME doesn't exist, no stress packing it up now"
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./src
    mv ./src.crx ./$NAME.crx
    mv ./src.pem ./$NAME.pem
  fi

  rm ./$NAME-chrome.zip
  create_zip $NAME-chrome
fi


echo "📦 👍  $NAME Packaging complete!"
