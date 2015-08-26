Meteor.methods({

  'contacts/create': function (contact, medialist) {
    check(contact, Object)
    check(medialist, String)
    if (!this.userId) throw new Meteor.Error('Only a logged in user can create a contact')

    contact.createdAt = new Date()
    contact.createdBy = this.userId
    contact.slug = contact.twitter || slugify(contact.name)
    contact.medialists = {}
    contact.medialists[medialist] = Contacts.status.toContact

    check(contact, Schemas.Contacts)
    Contacts.insert(contact)
    if (contact.twitter) {
      TwitterClient.grabUserByScreenName(contact.twitter, addTwitterDetailsToContact.bind(contact))
    }

    return contact
  },

  'contacts/addToMedialist': function (contactSlug, medialistSlug) {
    check(contactSlug, String)
    check(medialistSlug, String)

    var contact = Contacts.findOne({slug: contactSlug})

    if (!contact) throw new Meteor.Error('Contact #' + contactSlug + ' does not exist')
    if (typeof contact.medialists[medialistSlug] !== 'undefined') throw new Meteor.Error('Contact #' + contactSlug + ' is already in that medialist')
    if (!Medialists.find({slug: medialistSlug}).count()) throw new Meteor.Error('Medialist #' + medialistSlug + ' does not exist')

    var set = {}
    set['medialists.' + medialistSlug] = Contacts.status.toContact

    return Contacts.update({
      slug: contactSlug
    }, {
      $set: set
    })
  }

})

function addTwitterDetailsToContact(err, user) {
  if (err || !user) return console.log('Couldn\'t get Twitter info for ' + this.name)
  Contacts.update(this, {
    $set: {
      avatar: user.profile_image_url_https
    }
  })
}
