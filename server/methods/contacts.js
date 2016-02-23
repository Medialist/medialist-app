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
      languages: 'English',
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
        label: 'Twitter',
        value: details.screenName
      })
    }
    // return if a matching twitter handle already exists
    var existingContact = details.screenName && Contacts.findOne({ 'socials.label': 'Twitter', 'socials.value': details.screenName }, { transform: null })
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
  // MarkMolloy email 0 Work
  'contacts/setLabel': function (contactSlug, type, index, newLabel) {
    console.log('contacts/setLabel', contactSlug, type, index, newLabel)
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    if (['email', 'phone', 'social'].indexOf(type) < 0) throw new Meteor.Error('Bad type', type)
    if (Contacts[type + 'Types'].indexOf(newLabel) < 0) throw new Meteor.Error('Bad label', newLabel)
    checkContactSlug(contactSlug)
    check(index, Match.Integer)
    var prop = type + 's'
    var key = [prop, index, 'label'].join('.')
    var query = {}
    query[key] = newLabel
    return Contacts.update({ slug: contactSlug }, { $set: query })
  },

  'contacts/addPhone': function (contactSlug) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    checkContactSlug(contactSlug)
    var item = { label: 'Work', value:'', wip: this.userId }
    return Contacts.update({ slug: contactSlug }, { $push: { phones: item }})
  },

  'contacts/addEmail': function (contactSlug) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    checkContactSlug(contactSlug)
    var item = { label: 'Work', value:'', wip: this.userId }
    return Contacts.update({ slug: contactSlug }, { $push: { emails: item }})
  },

  'contacts/addSocial': function (contactSlug) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can add roles to a contact')
    checkContactSlug(contactSlug)
    var item = { label: 'LinkedIn', value:'', wip: this.userId }
    return Contacts.update({ slug: contactSlug }, { $push: { socials: item }})
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
  },

  // The client is just letting us know there is some work to do, they don't care about the response.
  'contacts/updateAvatar': function (contactSlug) {
    if (!this.userId) throw new Meteor.Error('Only logged in users can request avatar updates')
    check(contactSlug, String)
    // Can we still see their avatar?
    var contact = Contacts.findOne({slug: contactSlug}, {fields: {avatar: 1}})

    if (!contact) return

    HTTP.get(contact.avatar, err => {
      if (!err) return // avatar is fine. ignore.
      ContactsTask.queueUpdate(contact._id)
    })
  }
})

function addTwitterDetailsToContact(err, user) {
  if (err || !user) return console.log('Couldn\'t get Twitter info for ' + this.name)
  Contacts.update({ slug: this.slug, 'socials.label': 'Twitter' }, {
    $set: {
      avatar: user.profile_image_url_https,
      'socials.$.twitterId': user.id_str,
      'socials.$.value': user.screen_name
    }
  })
}

function checkContactSlug (contactSlug) {
  check(contactSlug, String)
  if (!Contacts.find({slug: contactSlug}).count()) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')
}