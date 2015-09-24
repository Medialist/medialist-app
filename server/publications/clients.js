Meteor.publish('clients', function (term) {
  if (!term) return this.ready()
  var regExp = new RegExp(term, 'i')
  return Clients.find( { name: regExp }, { limit: App.clientSuggestions } )
})
