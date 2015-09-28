// Global app settings
App = {
  contactSuggestions: 7,
  clientSuggestions: 5,
  cleanSlug: function(slug) {
    var newSlug = slug.replace(/[^a-zA-Z0-9_\-]/g, '')
    if (newSlug === newSlug.toUpperCase()) return newSlug.toLowerCase()
    return s.slugify(newSlug)
  }
}
