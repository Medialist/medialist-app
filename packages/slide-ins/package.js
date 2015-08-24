Package.describe({
  name: 'tableflip:slide-ins',
  version: '0.0.1',
  summary: 'Adds left and right slide-in menus',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3')
  api.use('templating@1.1.1', 'client')
  api.use('reactive-var@1.0.5', 'client')
  api.addFiles('slide-ins.html', 'client')
  api.addFiles('slide-ins.js', 'client')
  api.addFiles('slide-ins.css', 'client')
  api.export('SlideIns', 'client')
})
