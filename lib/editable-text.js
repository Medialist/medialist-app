EditableText.userCanEdit = function (doc, Collection) {
  if (Collection._name === 'contacts') return true
}

if (Meteor.isClient) {
  EditableText.registerCallbacks({
    generateUpdatePost (doc, Collection, newValue) { return newValue || '' }
  })
} else {
  EditableText.registerCallbacks({
    generateUpdatePost (doc) {
      if (!Meteor.userId()) throw new Meteor.Error('Only a logged in user can register an update')
      var user = Meteor.users.findOne(Meteor.userId())
      var firstName = App.firstName(this.field === 'name' ? this.newValue : doc.name)
      var fieldName = Contacts.fieldNames[this.field]
      var message
      if (!this.oldValue) {
        message = `added ${this.newValue} as ${fieldName}`
      } else if (!this.newValue) {
        message = `removed ${fieldName}`
      } else {
        message = `changed ${firstName}'s ${fieldName} from ${this.oldValue} to ${this.newValue}`
      }
      var post = {
        message: message,
        createdBy: {
          _id: user._id,
          name: user.profile.name
        },
        createdAt: new Date(),
        contacts: [{
          slug: doc.slug,
          name: this.field === 'name' ? this.newValue : doc.name
        }],
        type: 'details changed',
        medialists: [],
        details: {
          field: fieldName,
          oldValue: this.oldValue,
          newValue: this.newValue
        }
      }
      check(post, Schemas.Posts)
      Posts.insert(post)
      Contacts.update(doc._id, { $set: {
        'updatedBy._id': user._id,
        'updatedBy.name': user.profile.name,
        'updatedAt': new Date()
      }})
      return this.newValue
    }
  })
}
