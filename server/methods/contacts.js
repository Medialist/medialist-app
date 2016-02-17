Meteor.methods({

  'contacts/create': function (details, medialistSlug) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can create a contact')
    var user = Meteor.users.findOne(this.userId)
    var contact = {
      name: details.name,
      bio: details.bio,
      primaryOutlets: '',
      sectors: '',
      jobTitles: '',
      languages: ['English'],
      emails: [],
      phones: []
    }

    check(details, Object)
    if (medialistSlug) {
      check(medialistSlug, String)
      if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')
    }

    contact.createdAt = new Date()
    contact.createdBy = {
      _id: user._id,
      name: user.profile.name,
      avatar: user.services.twitter.profile_image_url_https
    }
    contact.updatedAt = contact.createdAt
    contact.updatedBy = contact.createdBy
    contact.socials = []
    if (details.screenName) {
      contact.socials.push({
        label: 'twitter',
        value: details.screenName
      })
    }
    // return if a matching twitter handle already exists
    var existingContact = details.screenName && Contacts.findOne({ 'socials.label': 'twitter', 'socials.value': details.screenName }, { transform: null })
    if (existingContact) return existingContact
    contact.avatar = '/images/avatar.svg'
    contact.slug = details.screenName || App.cleanSlug(details.name)
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

    if (details.screenName) {
      TwitterClient.grabUserByScreenName(details.screenName, addTwitterDetailsToContact.bind(contact))
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
      Posts.createMedialistChange({
        contact,
        medialistSlug,
        action: 'added'
      })
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
      Posts.createMedialistChange({
        contact,
        medialistSlug,
        action: 'removed'
      })
    })

    App.medialistUpdated(medialistSlug, this.userId)
    return Medialists.update({
      slug: medialistSlug
    }, {
      $unset: unset
    })
  },

  'contacts/addDetails': function (contactSlug, details) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    check(contactSlug, String)
    var user = Meteor.users.findOne(this.userId)
    if (!Contacts.find({slug: contactSlug}).count()) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')

    var org = Orgs.findOne({ name: details.primaryOutlets })
    if (!org) {
      Orgs.insert({ name: details.primaryOutlets })
    }
    check(details, Schemas.ContactDetails)
    _.extend(details, {
      'updatedBy._id': user._id,
      'updatedBy.name': user.profile.name,
      'updatedBy.avatar': user.services.twitter.profile_image_url_https,
      'updatedAt': new Date()
    })
    return Contacts.update({ slug: contactSlug }, { $set: details })
  },

  'contacts/togglePhoneType': function (contactSlug) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    check(contactSlug, String)
    var user = Meteor.users.findOne(this.userId)
    var contact = Contacts.findOne({ slug: contactSlug })
    if (!contact) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')

    if (!contact.phones || !contact.phones.length) return Contacts.update({ slug: contactSlug }, {$push: {
      phones: { label: Contacts.phoneTypes[1] }
    }})
    var phoneTypeInd = Contacts.phoneTypes.indexOf(contact.phones[0].label)
    var newPhoneType = Contacts.phoneTypes[(phoneTypeInd + 1) % Contacts.phoneTypes.length]

    return Contacts.update({ slug: contactSlug }, {$set: {
      'phones.0.label': newPhoneType,
      'updatedBy._id': user._id,
      'updatedBy.name': user.profile.name,
      'updatedBy.avatar': user.services.twitter.profile_image_url_https,
      'updatedAt': new Date()
    }})
  }
})

function addTwitterDetailsToContact(err, user) {
  if (err || !user) return console.log('Couldn\'t get Twitter info for ' + this.name)
  Contacts.update({ slug: this.slug, 'socials.label': 'twitter' }, {
    $set: {
      avatar: user.profile_image_url_https,
      'socials.$.id': user.id_str
    }
  })
}
