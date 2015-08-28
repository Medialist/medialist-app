Meteor.publish('latestPost', function (medialistSlug, contactSlug) {
  if (!this.userId) return this.ready()
  return Posts.find({
    medialists: medialistSlug,
    contacts: contactSlug,
    message: { $exists: true }
  }, {
    sort: {
      createdAt: -1
    },
    limit: 1
  })
})

Meteor.publish('postsByContact', function (contactSlug) {
  if (!this.userId) return this.ready()
  return Posts.find({
    contacts: contactSlug
  }, {
    sort: {
      createdAt: -1
    },
    limit: 10
  })
})
