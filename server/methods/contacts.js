Meteor.methods({

  'contacts/create': function (contact, medialistSlug) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can create a contact')
    var user = Meteor.users.findOne(this.userId)

    check(contact, Object)
    if (medialistSlug) {
      check(medialistSlug, String)
      if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')
    }

    contact.createdAt = new Date()
    contact.createdBy = {
      _id: user._id,
      name: user.profile.name
    }
    contact.twitter = {}
    if (contact.screenName) {
      contact.twitter.screenName = contact.screenName
      delete contact.screenName
    }
    contact.roles = []
    contact.avatar = '/images/avatar.svg'
    contact.slug = contact.twitter.screenName || s.slugify(contact.name)
    contact.medialists = []
    if (medialistSlug) contact.medialists.push(medialistSlug)
    check(contact, Schemas.Contacts)
    Contacts.insert(contact)

    if (medialistSlug) {
      var updateMedialist = {}
      updateMedialist['contacts.' + contact.slug] = Contacts.status.toContact
      Medialists.update({ slug: medialistSlug }, {$set: updateMedialist})
      App.medialistUpdated(medialistSlug, this.userId)
    }

    if (contact.twitter.screenName) {
      TwitterClient.grabUserByScreenName(contact.twitter.screenName, addTwitterDetailsToContact.bind(contact))
    }
    return contact
  },

  'contacts/addToMedialist': function (contactSlug, medialistSlug) {
    check(contactSlug, String)
    check(medialistSlug, String)
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add contacts to a medialist')
    var contact = Contacts.findOne({slug: contactSlug})
    if (!contact) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')
    if (contact.medialists.indexOf(medialistSlug) > -1) throw new Meteor.Error('Contact #' + contactSlug + ' is already in that medialist')
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')

    var set = {}
    set['contacts.' + contactSlug] = Contacts.status.toContact

	App.medialistUpdated(medialistSlug, this.userId)
    Contacts.update({ slug: contactSlug }, { $push: { medialists: medialistSlug } })
    return Medialists.update({
      slug: medialistSlug
    }, {
      $set: set
    })
  },

  'contacts/addRole': function (contactSlug, role) {
    check(contactSlug, String)
    check(role, Schemas.Roles)
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    if (!Contacts.find({slug: contactSlug}).count()) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')

    return Contacts.update({ slug: contactSlug }, {$push: {
      roles: role
    }})
  }

})

function addTwitterDetailsToContact(err, user) {
  if (err || !user) return console.log('Couldn\'t get Twitter info for ' + this.name)
  Contacts.update(this, {
    $set: {
      avatar: user.profile_image_url_https,
      'twitter.id': user.id_str
    }
  })
}
