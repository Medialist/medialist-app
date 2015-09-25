var roleValidator = Schemas.Roles.namedContext('roles')

Template.editContactRoles.onCreated(function () {
  this.subscribe('contact', this.data.slug)
  this.phoneType = new ReactiveVar('mobile')
  this.validationError = new ReactiveVar()
})

Template.editContactRoles.onRendered(function () {
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

Template.editContactRoles.helpers({
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

Template.editContactRoles.events({
  'click [data-action=toggle-phone-type]': function (evt, tpl) {
    if (tpl.phoneType.get() === 'mobile') {
      tpl.phoneType.set('landline')
    } else {
      tpl.phoneType.set('mobile')
    }
  },
  'submit': function (evt, tpl) {
    evt.preventDefault()

    var fields = ['title', 'email']
    var role = fields.reduce(function (role, field) {
      var value = tpl.$('#contact-role-' + field).val()
      if (value) role[field] = value
      return role
    }, {})
    role.org = {
      name: tpl.$('#contact-role-org').val(),
      _id: Random.id()
    }
    var number = tpl.$('#contact-role-number').val()
    if (number) {
      role.phones = [{
        number: number,
        type: tpl.phoneType.get()
      }]
    } else {
      role.phones = []
    }

    if (!role.org && !role.title) {
      return Modal.hide()
    }

    if (!roleValidator.validate(role)) {
      return tpl.validationError.set(roleValidator.keyErrorMessage(roleValidator.invalidKeys()[0].name))
    }

    Meteor.call('contacts/addRole', tpl.data.slug, role, function (err) {
      if (err) return console.error(err)
      Modal.hide()
    })
  }
})
