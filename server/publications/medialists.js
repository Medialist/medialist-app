Meteor.publish('medialist', function (slug) {
  var contactsQuery = {}
  contactsQuery['medialists.' + slug] = { $exists: true }
  return [
    Medialists.find({ slug: slug }),
    Contacts.find(contactsQuery)
  ]
})
