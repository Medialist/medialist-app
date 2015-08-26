Template.createContact.events({
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var fields = ['name', 'twitter', 'org', 'title', 'bio', 'email', 'phone']
    var contact = fields.reduce(function (contact, field) {
      var value = tpl.$('#contact-create-' + field).val()
      if (value) contact[field] = value
      return contact
    }, {})

    contact.emails = [{
      address: contact.email,
      type: 'work'
    }]
    delete contact.email

    contact.phones = [{
      number: contact.phone,
      type: 'work'
    }]
    delete contact.phone

    contact.jobs = [{
      org: contact.org,
      title: contact.title
    }]
    delete contact.org
    delete contact.title

    Meteor.call('contacts/create', contact, tpl.data.medialist, function (err) {
      if (err) return console.error(err)
      Modal.hide()
    })
  }
})
