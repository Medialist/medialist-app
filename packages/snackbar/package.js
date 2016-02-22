Package.describe({
  name: 'tableflip:snackbar',
  version: '0.0.0',
  summary: 'Make the API to snackbar.js better'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.1')
  api.use('jquery', 'client')
  api.addFiles('lib/snackbar.css', 'client')
  api.addFiles('lib/material.css', 'client')
  api.addFiles('lib/snackbar.js', 'client')
  api.addFiles('snackbar.css', 'client')
  api.addFiles('snackbar.js', 'client')
  api.export('Snackbar', 'client')
})
