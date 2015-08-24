Package.describe({
  name: 'material-design-less',
  version: '0.0.1',
  summary: 'Material design for Bootstrap, packaged to expose less files',
  git: 'git@github.com:FezVrasta/bootstrap-material-design.git',
})

Package.onUse(function(api) {
  var fontFiles = [
    'Material-Design-Icons.eot',
    'Material-Design-Icons.svg',
    'Material-Design-Icons.ttf',
    'Material-Design-Icons.woff',
    'RobotoDraftBold.woff',
    'RobotoDraftBold.woff2',
    'RobotoDraftItalic.woff',
    'RobotoDraftItalic.woff2',
    'RobotoDraftMedium.woff',
    'RobotoDraftMedium.woff2',
    'RobotoDraftRegular.woff',
    'RobotoDraftRegular.woff2'
  ]
  var lessFiles = [
    '_alerts.less',
    '_buttons.less',
    '_cards.less',
    '_checkboxes.less',
    '_colors.less',
    '_dialogs.less',
    '_dividers.less',
    '_icons.less',
    '_icons-material-design.less',
    '_inputs.less',
    '_labels.less',
    '_lists.less',
    'material-fullpalette.less',
    'material.less',
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
    'ripples.less',
    'roboto.less',
    '_shadows.less',
    '_tabs.less',
    '_togglebutton.less',
    '_variables.less',
    '_welljumbo.less'
  ]
  var scriptFiles = [
    'material.js',
    'ripples.js'
  ]

  api.versionsFrom('1.1.0.3')
  fontFiles.forEach(function (file) {
    api.addFiles('fonts/' + file, 'client')
  })
  lessFiles.forEach(function (file) {
    api.addFiles('less/' + file, 'server', {isAsset: true})
  })
  scriptFiles.forEach(function (file) {
    api.addFiles('scripts/' + file, 'client')
  })
})
