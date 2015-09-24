var phoneType = new ReactiveVar('mobile')
var validationError = new ReactiveVar()
var roleValidator = Schemas.Roles.namedContext('roles')

Template.editContactRoles.onCreated(function () {
  this.subscribe('contact', this.data.slug)
})

Template.editContactRoles.onDestroyed(function () {
  validationError.set()
})

Template.editContactRoles.helpers({
  contact: function () {
    return Contacts.findOne({slug: this.slug})
  },
  phoneType: function () {
    return phoneType.get()
  },
  validationError: function () {
    return validationError.get()
  }
})

Template.editContactRoles.events({
  'click [data-action=toggle-phone-type]': function () {
    if (phoneType.get() === 'mobile') {
      phoneType.set('landline')
    } else {
      phoneType.set('mobile')
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
        type: phoneType.get()
      }]
    } else {
      role.phones = []
    }

    if (!role.org && !role.title) {
      return Modal.hide()
    }

    if (!roleValidator.validate(role)) {
      return validationError.set(roleValidator.keyErrorMessage(roleValidator.invalidKeys()[0].name))
    }

    Meteor.call('contacts/addRole', tpl.data.slug, role, function (err) {
      if (err) return console.error(err)
      Modal.hide()
    })
  }
})
