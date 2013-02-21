({
  baseUrl : "./",
  dir : "../release/",
  optimize : 'none',
  // optimize : 'uglify',
  // uglify : {
  // toplevel : true,
  // ascii_only : true,
  // beautify : true,
  // max_line_length : 1000
  // },
  // inlineText: true,
  // namespace: 'fielddb',
  skipModuleInsertion : false,
  stubModules : [ 'angular', 'angular-ui', 'angular-resource',
      'angular-bootstrap-templates' ],
  // wrap: {
  // start: "(function() {",
  // end: "}());"
  // },
  mainConfigFile : "oprime.js",
  modules : [ {
    name : "oprime"
  } ]
})