Meteor.publish('medialists', function () {
  if (!this.userId) return []
  return Medialists.find({}, { limit: 100 })
})

Meteor.publish('medialist', function (slug) {
  if (!this.userId) return []
  return [
    Medialists.find({ slug: slug }),
    Contacts.find({ medialists: slug })
  ]
})

Meteor.publish('medialist-favourites', function () {
  if (!this.userId) return []
  return Medialists.find({}, {limit:7, sort: [['createdAt', 'desc']]})
})
