Meteor.publish('posts', function (medialistSlug, contactSlug, limit, message) {
  check(medialistSlug, String)
  check(contactSlug, String)
  if (!message) message = false
  check(message, Boolean)
  if (!limit) limit = 1
  check(limit, Number)
  if (!this.userId) return this.ready()
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

Meteor.publish('recentPosts', function () {
  if (!this.userId) return this.ready()
  return Posts.find({}, {
    sort: {
      createdAt: -1
    },
    limit: 10
  })
})
