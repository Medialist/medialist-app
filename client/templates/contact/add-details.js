var detailsValidator = Schemas.ContactDetails.namedContext('details')

Template.addContactDetails.onCreated(function () {
  this.subscribe('contact', this.data.slug)
  this.phoneType = new ReactiveVar('mobile')
  this.validationError = new ReactiveVar()
})

Template.addContactDetails.onRendered(function () {
  $('.typeahead').typeahead({
    source: (query, cb) => {
      Meteor.call('orgs/search', query, (err, res) => {
        if (err) return console.error(err)
        cb(res)
      })
    },
    items: 5
  })
})

Template.addContactDetails.helpers({
  contact: function () {
    return Contacts.findOne({slug: this.slug})
  },
  phoneType: function () {
    return Template.instance().phoneType.get()
  },
  validationError: function () {
    return Template.instance().validationError.get()
  }
})

Template.addContactDetails.events({
  'click [data-action=toggle-phone-type]': function (evt, tpl) {
    if (tpl.phoneType.get() === 'mobile') {
      tpl.phoneType.set('landline')
    } else {
      tpl.phoneType.set('mobile')
    }
  },
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var details = {
      jobTitle: tpl.$('#contact-job-title').val(),
      primaryOutlets: tpl.$('#contact-primary-outlets').val()
    }
    var number = tpl.$('#contact-number').val()
    if (number) {
      details.phones = [{
        value: number,
        label: tpl.phoneType.get()
      }]
    } else {
      details.phones = []
    }
    var email = tpl.$('#contact-email').val()
    if (email) {
      details.emails = [{
        value: email,
        label: 'primary'
      }]
    } else {
      details.emails = []
    }

    if (!details.org && !details.jobTitle) {
      return Modal.hide()
    }

    if (!detailsValidator.validate(details)) {
      return tpl.validationError.set(detailsValidator.keyErrorMessage(detailsValidator.invalidKeys()[0].name))
    }

    Meteor.call('contacts/addDetails', tpl.data.slug, details, function (err) {
      if (err) return console.error(err)
      Modal.hide()
    })
  }
})
