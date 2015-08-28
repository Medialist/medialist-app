Meteor.methods({
  'posts/create': function (contact, medialist, message, status) {
    check(contact, String)
    check(medialist, String)
    check(message, String)
    check(status, Match.OneOf.apply(null, _.values(Contacts.status)))
    if (!this.userId) throw new Meteor.Error('Only a logged in user can post feedback')
    if (!Medialists.find({slug: medialist}).count()) throw new Meteor.Error('Cannot find medialist #' + medialist)
    if (!Contacts.find({slug: contact}).count()) throw new Meteor.Error('Cannot find contact @' + contact)

    var extraMedialists = _.filter(findHashtags(message), function (hashtag) {
      return Medialists.find({slug: hashtag}).count()
    })
    var medialists = _.uniq(extraMedialists.concat(medialist))
    var extraContacts = _.filter(findHandles(message), function (handle) {
      return Contacts.find({slug: handle}).count()
    })
    var contacts = _.uniq(extraContacts.concat(contact))

    var post = {
      createdBy: this.userId,
      createdAt: new Date(),
      message: message,
      contacts: contacts,
      medialists: medialists,
      status: status
    }

    var contactUpdate = {}
    contactUpdate['medialists.' + medialist] = status
    Contacts.update({ slug: contact }, { $set: contactUpdate })
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
