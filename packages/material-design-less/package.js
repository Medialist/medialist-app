Package.describe({
  name: 'tableflip:material-design-less',
  version: '0.0.1',
  summary: 'Material design for Bootstrap, packaged to expose less files',
  git: 'git@github.com:FezVrasta/bootstrap-material-design.git',
})

Package.onUse(function(api) {
  api.use('less');

  var scriptFiles = [
    'material.js',
    'ripples.js'
  ]

  var lessFiles = [
    '_alerts.less',
    '_buttons.less',
    '_cards.less',
    '_checkboxes.less',
    '_colors.less',
    '_dialogs.less',
    '_dividers.less',
    '_icons-material-design.less',
    '_icons.less',
    '_inputs.less',
    '_labels.less',
    '_lists.less',
    '_mixins-fullpalette.less',
    '_mixins.less',
    '_navbar.less',
    '_panels.less',
    '_plugin-dropdownjs.less',
    '_plugin-nouislider.less',
    '_plugin-selectize.less',
    '_plugin-snackbarjs.less',
    '_popups.less',
    '_progress.less',
    '_radios.less',
    '_shadows.less',
    '_tabs.less',
    '_togglebutton.less',
    '_variables.less',
    '_welljumbo.less',
    'material-fullpalette.less',
    'material.less',
    'ripples.less',
    'roboto.less'
  ]

  scriptFiles.forEach(function (file) {
    api.addFiles('scripts/' + file, 'client')
  })

  lessFiles.forEach(function (file) {
    api.addFiles('less/' + file, 'client', {isImport:true})
  })
})
