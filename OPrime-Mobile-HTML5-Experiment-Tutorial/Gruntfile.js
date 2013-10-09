module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= pkg.licenses %> */\n',
    // Task configuration.
    exec: {
      echo_help: {
        cmd: function() {
          return 'echo "\n\nYou can use this project to download sample experiments, and build them into Phonegap (Cordova) wrapped packaged apps to use on your lab\'s tablets or on the app stores (delivered via the Android Google Play store, and/or the Apple Store)\n\n  See Gruntfile.js for what you can do with this project"';
        }
      },
      android_build: {
        cmd: function() {
          return 'cd platforms/android && ant clean debug install';
        }
      },
      android_test: {
        cmd: function() {
          return 'android update project -p ./platforms/android && cd platforms/android && ant clean debug install';
        }
      },
      android_test_webview: {
        cmd: function() {
          return 'ls android-server-2.32.0.apk || { curl -O --retry 999 --retry-max-time 0 -C -  https://selenium.googlecode.com/files/android-server-2.32.0.apk; } && adb install android-server-2.32.0.apk || { echo "Already installed"; } && adb  shell am start -a android.intent.action.MAIN -n org.openqa.selenium.android.app/.MainActivity -e debug true && adb  forward tcp:8080 tcp:8080 || { echo "Webdriver already started and bound to socket"; } ';
        }
      },
      ios: {
        cmd: function() {
          return 'cordova build ios && env DEVICE_FAMILY=ipad ./platforms/ios/cordova/emulate';
        }
      },
      ios_test: {
        cmd: function() {
          return 'echo "There are no tests set up for the iOS platform" ';
        }
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    nodeunit: {
      files: ['test/**/*_test.js']
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
          jshintrc: '.jshintrc'
        },
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify', 'exec:echo_help']);

};