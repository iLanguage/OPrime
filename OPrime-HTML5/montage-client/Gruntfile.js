module.exports = function(grunt) {
    'use strict';

    var montageMobileWebViewsRoot = "../montage-mobile-webviews";
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        exec: {
            normalizeAudio: {
                cmd: function() {
                    return "cd assets/stimuli/audio/ && for f in *; do ffmpeg -i $f -c:a pcm_s16le ${f%.*}.wav; done; && for f in *.wav; do  normalize $f; done; &&  for f in *.wav; do ffmpeg -i $f -ac 1 -ar 22050 ${f%.*}.mp3; done;";
                }
            },
            reduceImageSize: {
                cmd: function() {
                    return "cd assets/stimuli/image/ && mogrify -filter lanczos2 -resize '400x300>' *.png";
                }
            },
            optimizeImages: {
                cmd: function() {
                    return 'for f in *.jpg; do convert $f ${f%.*}.png; done; && optipng assets/stimuli/image/*.png';
                }
            },
            renameFilesToBeWebFriendly: {
                cmd: function() {
                    return 'for f in *; do short=`echo $f | sed "s/(/_/g" | sed "s/[ )(]//g" | sed "s/\.wav//g" | sed "s/É/E/g" | sed "s/é/e/g" | sed "s/é/e/g"`; mv  "$f" "$short" ; done;';
                }
            },
            echoHelp: {
                cmd: function() {
                    return 'echo " "';
                }
            },
            updateAssetsFromWww: {
                cmd: function() {
                    return './scripts/copyAssetsFromWwwToPlatforms.sh';
                }
            },
            buildCodebaseForProduction: {
                cmd: function() {
                    // return 'cd node_modules/popcorn && mop && cd ../../node_modules/paparazzi && mop && cd ../../node_modules/calculator && mop && cd ../../node_modules/photofx && mop && cd ../../node_modules/card && mop && cd ../../node_modules/storyboard && mop ';
                    return ' mop --version || {sudo npm install -g mop } && mop ';
                }
            },
            androidDebug: {
                cmd: function() {
                    return 'cd ' + montageMobileWebViewsRoot + '&& cordova run android';
                }
            },
            androidBuild: {
                cmd: function() {
                    return 'cd ' + montageMobileWebViewsRoot + '/platforms/android && ant clean debug install';
                }
            },
            androidTest: {
                cmd: function() {
                    return 'cd ' + montageMobileWebViewsRoot + ' && android update project -p ./platforms/android && cd platforms/android && ant clean debug install';
                }
            },
            androidDebugWebview: {
                cmd: function() {
                    return 'ls android-server-2.32.0.apk || { curl -O --retry 999 --retry-max-time 0 -C -  https://selenium.googlecode.com/files/android-server-2.32.0.apk; } && adb install android-server-2.32.0.apk || { echo "Already installed"; } && adb  shell am start -a android.intent.action.MAIN -n org.openqa.selenium.android.app/.MainActivity -e debug true && adb  forward tcp:8080 tcp:8080 || { echo "Webdriver already started and bound to socket"; } ';
                }
            },
            iosDebug: {
                cmd: function() {
                    return 'cd ' + montageMobileWebViewsRoot + ' && cordova build ios && ./platforms/ios/cordova/run ';
                }
            },
            iosTest: {
                cmd: function() {
                    return 'echo "There are no tests set up for the iOS platform" ';
                }
            },
            /* https://code.google.com/p/selenium/wiki/AndroidDriver */
            seleniumTest: {
                cmd: function() {
                    return 'echo "TODO now we can run javascript tests in the Android WebView by contacting http://localhost:8080/wd/hub" ';
                }
            },
            cordovaJsTest: {
                cmd: function() {
                    return 'cd ' + montageMobileWebViewsRoot + ' &&  mkdir deps || echo "" ; cd deps ;  git clone https://github.com/apache/cordova-mobile-spec.git || echo "" ;  cordova platform add ios android ; cordova plugin add ../cordova-mobile-spec/dependencies-plugin ; rm -r www ; ln -s ../cordova-mobile-spec www ; cordova platform add android ; cordova run android ; ';
                }
            },
            cordovaAndroidDebug: {
                cmd: function() {
                    return 'cd ' + montageMobileWebViewsRoot + ' && mkdir deps || echo "" ; cd deps ; git clone https://github.com/apache/cordova-android.git || echo "" ; cd cordova-android/framework ; android update project -p . -t android-18 --subprojects ; ant debug install  ; ant jar ; cd ../test && mkdir libs ||  echo ""  ; cp ../framework/cordova* libs/ ; android update project -p . -t android-18 --subprojects ; ant debug install ; adb shell am instrument -w org.apache.cordova.test/android.test.InstrumentationTestRunner ';
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= jshint.lib.src %>'],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        tests: {
            files: ['test/**/*Test.js'],
        },
        jasmine_node: { //jshint ignore:line
            specNameMatcher: 'spec',
            projectRoot: './',
            requirejs: false,
            forceExit: true,
            isVerbose: true,
            showColors: true,
            jUnit: {
                report: true,
                savePath: './build/reports/jasmine/',
                consolidate: true,
                useDotNotation: false
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                options: {
                    jshintrc: 'lib/.jshintrc'
                },
                src: ['lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            },
            codebase: {
                src: ['ui/**/*.js', 'core/**/*.js']
            }
        },
        jsdoc: {
            dist: {
                jsdoc: 'node_modules/.bin/jsdoc',
                src: ['core/**/*.js', 'ui/**/*.js', 'lib/**/*.js'],
                options: {
                    destination: 'doc/javascript'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'jasmine_node']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'jasmine_node']
            },
            codebase: {
                src: ['ui/**/*.js', 'core/**/*.js']
            }
        },
        copy: {
            codebase: {
                files: [{
                    expand: true,
                    src: ['builds/<%= pkg.name %>/**'],
                    dest: montageMobileWebViewsRoot + '/www/'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('docs', ['jsdoc']);

    grunt.registerTask('reduceImageSize', ['exec:reduceImageSize', 'exec:optimizeImages']);
    grunt.registerTask('default', ['jshint', 'jasmine_node']); //jshint ignore:line

    // Default task.
    // grunt.registerTask('default', ['jshint', 'exec:echoHelp']);

    // Warning calling update will download all the latest codebase and build them into the app, replacing any previous codebase
    grunt.registerTask('update', ['jshint', 'exec:buildCodebaseForProduction', 'exec:updateAssetsFromWww', 'copy:codebase']);

    // Build and debug/test on devices
    grunt.registerTask('android', ['jshint', 'exec:android']);
    grunt.registerTask('ios', ['jshint', 'exec:ios']);

    // Run tests on emulators/devices using travis/jenkins
    grunt.registerTask('debug-android', ['jshint', 'exec:buildCodebaseForProduction', 'copy:codebase', 'exec:androidDebug']);
    grunt.registerTask('debug-ios', ['jshint', 'copy:codebase', 'exec:iosDebug']);
    grunt.registerTask('debug', ['exec:androidDebug', 'exec:iosDebug']);

    // Run everything to set up a new machine or continuous integration tests for travis/jenkins
    grunt.registerTask('everything', ['exec:updateAssetsFromWww', 'exec:androidBuild', 'exec:androidDebugWebview', 'exec:seleniumTest']);
    // grunt.registerTask('ci-test', ['update', 'exec:androidBuild', 'test']);
};
