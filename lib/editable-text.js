EditableText.userCanEdit = function (doc, Collection) {
  if (['contacts', 'medialists'].indexOf(Collection._name) > -1) return true
}

function generateUpdatePostClient (doc, Collection, newValue) { return newValue || '' }
function generateUpdatePostServer (doc, Collection) {
  if (!Meteor.userId()) throw new Meteor.Error('Only a logged in user can register an update')
  var user = Meteor.users.findOne(Meteor.userId())
  var fieldName = Contacts.fieldNames(this.field)
  var message
  if (!this.oldValue) {
    message = `added ${this.newValue} as ${fieldName}`
  } else if (!this.newValue) {
    message = `removed ${fieldName}`
  } else {
    if (Collection._name === 'contacts') {
      var firstName = App.firstName(this.field === 'name' ? this.newValue : doc.name)
      message = `changed ${firstName}'s ${fieldName} from ${this.oldValue} to ${this.newValue}`
    } else {
      message = `changed the name of #${doc.slug} from ${this.oldValue} to ${this.newValue}`
    }
  }
  var post = {
    message: message,
    createdBy: {
      _id: user._id,
      name: user.profile.name,
      avatar: user.services.twitter.profile_image_url_https
    },
    createdAt: new Date(),
    type: 'details changed',
    details: {
      field: fieldName,
      oldValue: this.oldValue,
      newValue: this.newValue
    }
  }
  if (Collection._name === 'contacts') {
    post.contacts = [{
      slug: doc.slug,
      name: this.field === 'name' ? this.newValue : doc.name
    }]
    post.medialists = []
  } else if (Collection._name === 'medialists') {
    post.medialists = [doc.slug]
    post.contacts = []
  }
  check(post, Schemas.Posts)
  Posts.insert(post)
  Collection.update(doc._id, { $set: {
    'updatedBy._id': user._id,
    'updatedBy.name': user.profile.name,
    'updatedBy.avatar': user.services.twitter.profile_image_url_https,
    'updatedAt': new Date()
  }})

  return this.newValue
}

if (Meteor.isClient) {
  EditableText.registerCallbacks({
    generateUpdatePost: generateUpdatePostClient,
    generateUpdatePostTwitter: generateUpdatePostClient
  })
} else {
  EditableText.registerCallbacks({
    generateUpdatePost: generateUpdatePostServer,
    generateUpdatePostTwitter: function (doc) {
      var val = generateUpdatePostServer.call(this, doc)
      return twitterScreenName(val)
    }
  })
}
