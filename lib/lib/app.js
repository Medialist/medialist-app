// Global app settings
App = {
  contactSuggestions: 7,
  clientSuggestions: 5,
  cleanSlug: function(slug) {
    return slug.replace(/[^a-zA-Z0-9_\-]/g, '')
  },
  uniqueSlug: function (slug, collection) {
    var newSlug = slug
    var suffix = 1
    while (collection.find({ slug: slug }).count()) {
      newSlug = slug + suffix.toString()
      suffix += 1
    }
    return newSlug
  }
}
