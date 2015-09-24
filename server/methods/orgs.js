Meteor.methods({
  'orgs/search': function (term) {
    if (!term) return []
    var regExp = new RegExp(term, 'i')
    return Orgs.find( { name: regExp }, { limit: App.clientSuggestions } ).map( org => org.name )
  }
})
