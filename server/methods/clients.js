Meteor.methods({
  'clients/search': function (term) {
    if (!term) return []
    var regExp = new RegExp(term, 'i')
    return Clients.find( { name: regExp }, { limit: App.clientSuggestions } ).map( client => client.name )
  }
})
