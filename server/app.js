App.medialistUpdated = function (medialistSlug, userId) {
  var user = Meteor.users.findOne(userId)
  if (!user) throw new Meteor.Error('unknown-user', 'Medialist cannot be updated by an unknown user')
  return Medialists.update({slug: medialistSlug}, {$set: {
    'updatedBy._id': user._id,
    'updatedBy.name': user.profile.name,
    'updatedAt': new Date()
  }})
}

App.checkSlug = function (slug, collection) {
  var originalSlug = slug
  var numeral = 1
  var docCount = collection.find({ slug: slug }).count()
  while (docCount) {
    slug = originalSlug + numeral.toString()
    numeral += 1
    docCount = collection.find({ slug: slug }).count()
  }
  return slug
}
