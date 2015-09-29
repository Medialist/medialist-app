Package.describe({
  name: 'tableflip:tablesort',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1')
  api.use('ecmascript')
  api.addFiles('tablesort/tablesort.js', 'client')
  api.addFiles('tablesort/tablesort.date.js', 'client')
  api.addFiles('tablesort/tablesort.numeric.js', 'client')
  api.addFiles('tablesort-meteor.js', 'client')
  api.export('MeteorTablesort', 'client')
})
