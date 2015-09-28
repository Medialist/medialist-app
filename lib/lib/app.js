// Global app settings
App = {
  contactSuggestions: 7,
  clientSuggestions: 5,
  cleanSlug: function(slug) {
    return slug.replace(/[^a-zA-Z0-9_\-]/g, '')
  }
}
