Meteor.publish('posts', function (opts) {
  if (!this.userId) return this.ready()
  opts = opts || {}
  check(opts, {
    medialist: Match.Optional(String),
    contact: Match.Optional(String),
    message: Match.Optional(Boolean),
    limit: Match.Optional(Number)
  })

  var query = {}
  if (opts.medialistSlug) query.medialists = opts.medialist
  if (opts.contactSlug) query.contacts = opts.contact
  if (opts.message) query.message = { $exists: true }

  var options = {
    sort: { createdAt: -1 },
    limit: opts.limit || 1
  }

  return Posts.find(query, options)
})
