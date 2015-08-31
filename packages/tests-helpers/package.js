Package.describe({
  name: 'tests-helpers',
  version: '0.0.1',
  summary: 'Provide a method to log the user in without authentication (FOR TESTING PURPOSES ONLY)',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3')
  api.use('accounts-base@1.2.0')
  api.addFiles('tests-helpers.js', ['client', 'server'])
  api.export('testLogin', 'client')
})
