
// See: https://github.com/huttonr/bootstrap3/issues/12

Package.describe({
  // name: 'huttonr:bootstrap3',
  name: 'tableflip:bootstrap3', // renamed to avoid confusion
  summary: 'Modular, customizable Bootstrap 3.',
  version: '3.3.6_7',
  git: 'https://github.com/huttonr/bootstrap3',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('huttonr:bootstrap3-assets@3.3.6_2');
  api.use('less'); // Currently necessary, see https://github.com/huttonr/bootstrap3/issues/2
  api.use('ecmascript'); // Currently necessary

  api.addFiles('check-settings.js', 'client');
});

Package.registerBuildPlugin({
  name: 'build-bootstrap3',
  use: [
    'ecmascript@0.1.6',
    'huttonr:bootstrap3-assets@3.3.6_2'
  ],
  sources: [
    'plugin/bootstrap3.js'
  ],
  npmDependencies: {
    'less': '2.5.3'
  }
});
