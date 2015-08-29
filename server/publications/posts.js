Meteor.publish('posts', function (medialistSlug, contactSlug, limit, message) {
  if (!this.userId) return this.ready()
  if (!limit) limit = 1
  var query = {}
  if (medialistSlug) query.medialists = medialistSlug
  if (contactSlug) query.contacts = contactSlug
  if (message) query.message = { $exists: true }
  return Posts.find(query, {
    sort: {
      createdAt: -1
    },
    limit: limit
  })
})
