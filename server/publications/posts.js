Meteor.publish('posts', function (opts) {
  if (!this.userId) return this.ready()
  opts = opts || {}
  check(opts, {
    medialist: Match.Optional(String),
    contact: Match.Optional(String),
    message: Match.Optional(Boolean),
    type: Match.Optional(Match.OneOf(Boolean, String, { $ne: String })),
    limit: Match.Optional(Number)
  })

  var query = {}
  if (opts.medialistSlug) query.medialists = opts.medialist
  if (opts.contactSlug) query.contacts = { slug: opts.contact }
  if (opts.message) query.message = { $exists: true }
  if (opts.type === false) query.type = { $exists: false }
  if (opts.type) query.type = opts.type

  var options = {
    sort: { createdAt: -1 },
    limit: opts.limit || 1
  }

  return Posts.find(query, options)
})

Meteor.publish('need-to-knows', function (opts) {
  if (!this.userId) return this.ready()
  check(opts, {
    contact: String,
    limit: Match.Optional(Number)
  })

  var query = {
    'contacts.slug': opts.contact,
    'type': { $in: [
      'need to know',
      'details changed'
    ] }
  }
  var options = {
    sort: { createdAt: -1 },
    limit: opts.limit || 1
  }

  return Posts.find(query, options)
})
