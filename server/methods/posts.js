Meteor.methods({
  'posts/create': function (contact, medialistSlug, message, status) {
    check(contact, String)
    check(medialistSlug, String)
    check(message, Match.Where(function (message) {
      return !message || typeof message === 'string'
    }))
    check(status, Match.OneOf.apply(null, _.values(Contacts.status)))
    if (!this.userId) throw new Meteor.Error('Only a logged in user can post feedback')
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Cannot find medialist #' + medialistSlug)
    if (!Contacts.find({slug: contact}).count()) throw new Meteor.Error('Cannot find contact @' + contact)

    var thisUser = Meteor.users.findOne(this.userId)
    var extraMedialists = _.filter(findHashtags(message), function (hashtag) {
      return Medialists.find({slug: hashtag}).count()
    })
    var medialists = _.uniq(extraMedialists.concat(medialistSlug))
    var extraContacts = _.filter(findHandles(message), function (handle) {
      return Contacts.find({slug: handle}).count()
    })
    var contacts = _.uniq(extraContacts.concat(contact))

    var post = {
      createdBy: {
        _id: this.userId,
        name: thisUser.profile.name
      },
      createdAt: new Date(),
      contacts: contacts,
      medialists: medialists,
      status: status
    }
    if (message) post.message = message

    var contactUpdate = {}
    contactUpdate['medialists.' + medialistSlug] = status
    Contacts.update({ slug: contact }, { $set: contactUpdate })
    App.medialistUpdated(medialistSlug, this.userId)
    return Posts.insert(post)
  }
});

function findHashtags (message) {
  var hashtagRegex = /(?:#)(\S+)/ig
  var match
  var matches = []
  while ((match = hashtagRegex.exec(message)) !== null) {
    matches.push(match[1])
  }
  return matches
}

function findHandles (message) {
  var handleRegex = /(?:@)(\S+)/ig
  var match
  var matches = []
  while ((match = handleRegex.exec(message)) !== null) {
    matches.push(match[1])
  }
  return matches
}
