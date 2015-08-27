Meteor.publish('medialist', function (slug) {
  var contactsQuery = {}
  contactsQuery['medialists.' + slug] = { $exists: true }
  return [
    Medialists.find({ slug: slug }),
    Contacts.find(contactsQuery)
  ]
})

Meteor.publish('medialist-favourites', function () {
  if (!this.userId) return []
  return Medialists.find({}, {limit:5, sort: [['createdAt', 'desc']]})
})
