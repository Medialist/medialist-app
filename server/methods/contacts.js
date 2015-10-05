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
    // return if a matching twitter handle already exists
    var existingContact = contact.twitter.screenName && Contacts.findOne({ 'twitter.screenName': contact.twitter.screenName }, { transform: contact => contact })
    if (existingContact) return existingContact
    contact.roles = []
    contact.avatar = '/images/avatar.svg'
    contact.slug = contact.twitter.screenName || App.cleanSlug(contact.name)
    contact.slug = App.uniqueSlug(contact.slug, Contacts)
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

  'contacts/addToMedialist': function (contactSlugs, medialistSlug) {
    if (typeof contactSlugs === 'string') contactSlugs = [contactSlugs]
    check(contactSlugs, [String])
    check(medialistSlug, String)
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add contacts to a medialist')
    var set = {}

    _.each(contactSlugs, function (contactSlug) {
      var contact = Contacts.findOne({slug: contactSlug})
      if (!contact) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')
      set['contacts.' + contactSlug] = Contacts.status.toContact
      if (contact.medialists.indexOf(medialistSlug) === -1) Contacts.update({ slug: contactSlug }, { $push: { medialists: medialistSlug } })
    })

	  App.medialistUpdated(medialistSlug, this.userId)
    return Medialists.update({
      slug: medialistSlug
    }, {
      $set: set
    })
  },

  'contacts/removeFromMedialist': function (contactSlugs, medialistSlug) {
    if (typeof contactSlugs === 'string') contactSlugs = [contactSlugs]
    check(contactSlugs, [String])
    check(medialistSlug, String)
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add contacts to a medialist')
    var unset = {}

    _.each(contactSlugs, function (contactSlug) {
      var contact = Contacts.findOne({slug: contactSlug})
      if (!contact) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')
      unset['contacts.' + contactSlug] = true
      Contacts.update({ slug: contactSlug }, { $pull: { medialists: medialistSlug } })
    })

    App.medialistUpdated(medialistSlug, this.userId)
    return Medialists.update({
      slug: medialistSlug
    }, {
      $unset: unset
    })
  },

  'contacts/addRole': function (contactSlug, role) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    check(contactSlug, String)
    if (!Contacts.find({slug: contactSlug}).count()) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')

    var org = Orgs.findOne({ name: role.org.name })
    if (org) {
     role.org._id = org._id
    } else {
     role.org._id = Orgs.insert({ name: role.org.name })
    }
    check(role, Schemas.Roles)
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
