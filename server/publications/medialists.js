Meteor.publish('medialist', function (slug) {
  return [
    Medialists.find({ slug: slug }),
    Contacts.find({ medialists: slug })
  ]
})

Meteor.publish('medialist-favourites', function () {
  if (!this.userId) return []
  return Medialists.find({}, {limit:5, sort: [['createdAt', 'desc']]})
})
