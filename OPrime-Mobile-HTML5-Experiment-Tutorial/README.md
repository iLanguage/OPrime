# OPrime-Mobile-HTML5-Experiment-Tutorial

A tutorial for how to create mobile experiments or gamified experiments from your existing HTML5 app.

## Getting Started
### On the server
If you already have an experiment that is written in web technologies (HTML or HTML5) you can put it on a server (ie make it run online) by executing these commands:

```bash
mkdir your-experiment
cd your-experiment
npm install oprime-experiment-server
cp your-experiment-files public
cp node_modules/oprime-experiment/server/lib/server.js .
node server.js & 
```

### For an Android app

```bash
git clone https://github.com/iLanguage/OPrime
cd OPrime/OPrime-Mobile-HTML5-Experiment-Tutorial
./bin/setup.sh
```

### For an iPad or iPhone app

```bash
git clone https://github.com/iLanguage/OPrime
cd OPrime/OPrime-Mobile-HTML5-Experiment-Tutorial
./bin/setup.sh
```

## Documentation

Search YouTube.com for 'OPrime Experiment' to find and share screencasts

## Examples
```bash
$ git clone https://github.com/iLanguage/OPrime
$ cd OPrime/OPrime-Mobile-HTML5-Experiment-Tutorial
$ ./bin/setup.sh

H! Do you want to make an Android/iPad experiment using an existing HTML5 project?
(y/n) and press [ENTER]: y
Checking for Cordova version:
3.1.0-0.1.0
Okay, cordova is available. Let's continue...

Enter a package name for your app. You can use smith.adam or mycompany.com or mywebsite.ca (if you own that domain name)
Type smith.adam or com.mycompany etc, and press [ENTER]: beaudoin betty
Using: beaudoin.betty

Enter a title for your app. You can use whatever you want the app to be called on the tablets app list.
Type Alligators or HJ82 etc, and press [ENTER]: Production Experiment
Using: production-experiment

Putting your apps in a folder called 'myapps'

Enter the path to your existing HTML5 project that you want to use for your mobile app:
Drag and drop the folder in to the terminal to ge the path or type it, and press [ENTER]: /Users/myusername/Documents/ProductionExperiment1

cordova platform add android
Running your app on an attached Android
cordova run android
cordova platform add ios
If you have signed up to be an Apple developer, you can also run your app on an attached iPad
cordova build ios && ./platforms/ios/cordova/run
Adding some cordova plugins...
By the way, here are some other apps you can make:
   cordova platform add blackberry10
   cordova platform add firefoxos


Done!

Your app should be running on your Android now... For the next steps to tweek, modify or share your apk, you can follow the README

```

## Contributing

How to contribute to the project:

* [Signup for a GitHub account](https://github.com/signup/free) (GitHub is free for OpenSource)
* Click on the "Fork" button to create your own copy.
* Leave us a note in our [issue tracker](https://github.com/iLanguage/OPrime/issues) to tell us a bit about the bug/feature you want to work on.
* You can [follow the 4 GitHub Help Tutorials](http://help.github.com/) to install and use Git on your computer.
* Edit the code on your computer, commit it referencing the issue #xx you created ($ git commit -m "fixes #xx i changed blah blah...") and push to your origin ($ git push origin master).


## Release History


## License
Copyright (c) 2013 OPrime  
Licensed under the Apache 2.0 license.
