Meteor.methods({

  'contacts/create': function (contact, medialistSlug) {
    check(contact, Object)
    check(medialistSlug, String)
    if (!this.userId) throw new Meteor.Error('Only a logged in user can create a contact')
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')

    contact.createdAt = new Date()
    contact.createdBy = this.userId
    contact.twitter = {}
    if (contact.screenName) {
      contact.twitter.screenName = contact.screenName
      delete contact.screenName
    }
    contact.roles = []
    contact.avatar = '/images/avatar.svg'
    contact.slug = contact.twitter.screenName || slugify(contact.name)
    contact.medialists = {}
    contact.medialists[medialistSlug] = Contacts.status.toContact

    check(contact, Schemas.Contacts)
    Contacts.insert(contact)
    Medialists.update({ slug: medialistSlug }, { $set: {
      updatedBy: this.id,
      updatedAt: new Date()
    }})
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
    if (typeof contact.medialists[medialistSlug] !== 'undefined') throw new Meteor.Error('Contact #' + contactSlug + ' is already in that medialist')
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')

    var set = {}
    set['medialists.' + medialistSlug] = Contacts.status.toContact

    Medialists.update({ slug: medialistSlug }, { $set: {
      updatedBy: this.id,
      updatedAt: new Date()
    }})

    return Contacts.update({
      slug: contactSlug
    }, {
      $set: set
    })
  },

  'contacts/addRole': function (contactSlug, role) {
    check(contactSlug, String)
    check(role, Schemas.Roles)
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    if (!Contacts.find({slug: contactSlug}).count()) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')

    return Contacts.update({slug: contactSlug}, {$push: {
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
