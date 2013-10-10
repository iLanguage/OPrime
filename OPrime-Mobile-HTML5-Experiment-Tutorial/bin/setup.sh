#!/bin/bash

echo ""
echo "H! Do you want to make an Android/iPad experiment using an existing HTML5 project? ";
echo -n "(y/n) and press [ENTER]: "
read continue
if [[ $continue != y ]]
then {
    echo "Okay, exiting the set up script. "
    echo "If you want to know more about what this project can do you can read the ./bin/setup.sh file."
    exit 0;
}
fi

echo "Checking for Cordova version: "
cordova --version || {
    echo "You have to install Cordova, we are using this to make mobile apps quickly."
    echo "Please enter your password: "
    sudo npm install -g cordova
}

echo "Okay, cordova is available. Let's continue..."
echo ""
echo "Enter a package name for your app. You can use smith.adam or mycompany.com or mywebsite.ca (if you own that domain name)"
echo -n "Type smith.adam or com.mycompany etc, and press [ENTER]: "
read packagename
packagename="${packagename#"${packagename%%[![:space:]]*}"}"   # remove leading whitespace characters
packagename="${packagename%"${packagename##*[![:space:]]}"}"   # remove trailing whitespace characters
cleanedpackagename=${packagename//[^a-zA-Z0-9]/.};
echo "Using: "$cleanedpackagename
echo ""

echo 'Enter a title for your app. You can use whatever you want the app to be called on the tablets app list.'
echo -n 'Type Alligators or HJ82 etc, and press [ENTER]: '
read appname
lowercaseappname=${appname//[^a-zA-Z0-9]/-};
lowercaseappname=`echo $lowercaseappname | tr '[:upper:]' '[:lower:]'` 
echo "Using: "$lowercaseappname
echo ""

echo "Putting your apps in a folder called 'myapps' "
mkdir myapps ||{
    echo ""
}
cd myapps

cordova create $lowercaseappname $cleanedpackagename"."$lowercaseappname $appname || {
    echo "Opps something went wrong.. maybe your app names you chose aren't going to work. You will have to read the Cordova instructions";
    echo "http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface"
    open -a Google\ Chrome http://cordova.apache.org/docs/en/3.1.0/guide_cli_index.md.html#The%20Command-line%20Interface
    echo ""
    exit;
}
cd $lowercaseappname

echo "Enter the path to your existing HTML5 project that you want to use for your mobile app:"
echo -n 'Drag and drop the folder in to the terminal to ge the path or type it, and press [ENTER]: '
read apppath
cp -R $apppath/* www/ || {
    echo "Opps something went wrong.. You will have to copy the files into $lowercaseappname/www yourself ";
    echo ""
}

echo "cordova platform add android"
cordova platform add android
echo "Running your app on an attached Android"
echo "cordova run android"
cordova run android

echo "cordova platform add ios"
cordova platform add ios
echo "If you have signed up to be an Apple developer, you can also run your app on an attached iPad"
echo "cordova build ios && ./platforms/ios/cordova/run"
# sudo npm install -g ios-sim
# cordova build ios && env DEVICE_FAMILY=ipad ./platforms/ios/cordova/emulate 


echo "Adding some cordova plugins..."
cordova plugin add org.apache.cordova.console


echo "By the way, here are some other apps you can make:"
echo "   cordova platform add blackberry10"
echo "   cordova platform add firefoxos"

echo ""
echo ""
echo "Done!"
echo ""
echo "Your app should be running on your Android now... For the next steps to tweek, modify or share your apk, you can follow the README"
echo ""
echo ""
