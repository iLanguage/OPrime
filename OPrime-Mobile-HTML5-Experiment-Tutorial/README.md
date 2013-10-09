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
./bin/setup.sh
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
