# OPrime

OPrime HTML5 Experimentation libraries written in MontageJS

## Getting Started
### On the server
Install the module with: `npm install oprime-montage`

```javascript
var OPrime = require('OPrime');
var experiment = new OPrime.Experiment(); 
experiment.run();
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ProjetDeRechercheSurLecriture/OPrime/montage-client/dist/oprime-montage.min.js
[max]: https://raw.github.com/ProjetDeRechercheSurLecriture/OPrime/montage-client/dist/oprime-montage.js

In your web page:

```html
<script src="dist/oprime-montage.min.js"></script>
<script>
var experiment = new Experiment(); 
experiment.run();
</script>
```

In your code, you can attach OPrime's methods to any object.

```html
<script>
var exports = Bocoup.utils;
</script>
<script src="dist/oprime-montage.min.js"></script>
<script>
var experiment = new Bocoup.utils.Experiment(); 
experiment.run();
</script>
```

## Documentation


Layout
------

The template contains the following files and directories:

* `index.html`
* `package.json` – Describes your app and its dependencies
* `README.markdown` – This readme. Replace the current content with a description of your app
* `ui/` – Directory containing all the UI .reel directories.
  * `main.reel` – The main interface component
* `core/` – Directory containing all core code for your app.
* `node_modules/` – Directory containing all npm packages needed, including Montage. Any packages here must be included as `dependencies` in `package.json` for the Montage require to find them.
* `assets/` – Assets such as global styles and images for your app
* `test/` – Directory containing tests for your app.
  * `all.js` – Module that point the test runner to all your jasmine specs.
* `run-tests.html` – Page to run jasmine tests manually in your browser

Create the following directories if you need them:

* `locale/` – Directory containing localized content.
* `scripts/` – Directory containing other JS libraries. If a library doesn’t support the CommonJS "exports" object it will need to be loaded through a `<script>` tag.


## Examples
See test directory

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via Grunt. You'll find source code in the "lib" subdirectory!_

## Release History
Currently in feasibilty study...

## License
Copyright (c) 2013   
Licensed under the Apache, 2.0 licenses.
