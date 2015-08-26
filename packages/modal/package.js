Package.describe({
  name: 'tableflip:modal',
  version: '0.0.1',
  summary: 'Bootstrap modals for Meteor',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3')
  api.use('jquery@1.11.3_2', 'client')
  api.use('templating@1.1.1', 'client')
  api.use('reactive-var@1.0.5', 'client')
  api.addFiles('modal.html', 'client')
  api.addFiles('modal.js', 'client')
  api.export('Modal', 'client')
})
