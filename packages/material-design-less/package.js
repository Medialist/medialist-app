Package.describe({
  name: 'material-design-less',
  version: '0.0.1',
  summary: 'Material design for Bootstrap, packaged to expose less files',
  git: 'git@github.com:FezVrasta/bootstrap-material-design.git',
})

Package.onUse(function(api) {

  var scriptFiles = [
    'material.js',
    'ripples.js'
  ]

  api.versionsFrom('1.1.0.3')
  scriptFiles.forEach(function (file) {
    api.addFiles('scripts/' + file, 'client')
  })
})
